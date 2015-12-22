import request from 'request';
import {query} from './db';
import semaphore from 'semaphore';

const BATCH_SIZE = 10000;

export function fetchItem(id) {
    return new Promise((resolve, reject) => {
        request(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, (err, response) => {
            if (err) {
                return reject(err);
            }

            let json = JSON.parse(response.body);
            if (json) {
                return resolve(json);
            }

            reject(new Error(json));
        });
    });
}

export function populateDb(n) {
    let array = [...Array(n)].map((_, i) => `(${i + 1})`);

    return query(`insert into queue (id) values ${array.join(',')}`);
}

export function fetchInBatches() {
    return new Promise((resolve, reject) => {
        function next() {
            query('select count(*) from queue where done = false').then(({rows}) => {
                if (rows[0].count !== '0') {
                    fetchBatch(10, 2).then(next);
                } else {
                    resolve();
                }
            });
        }
        next();
    });
}

export function fetchBatch(batchSize = BATCH_SIZE, concurrency = 5) {
    return new Promise(async function(resolve, reject) {
        let {rows} = await query(`select id from queue where done = false limit ${batchSize}`);
        let ids = rows.map(r => r.id);
        let sem = semaphore(concurrency);
        console.log({ids});

        let results = [];
        let errors = [];


        ids.forEach((id) => {
            sem.take(() => {
                fetchItem(id).then((result) => {
                    console.log(id);
                    results.push(result);
                }).catch((err) => {
                    saveError(id, err);
                }).then(() => {
                    if (!sem.queue.length) {
                        saveBatch(results).then(resolve).catch(reject);
                    }
                    sem.leave();
                });
            })
        });

        sem.take(() => {
            console.log(results);
            resolve('DONE');
        });
    });
}



function saveBatch(batch) {
    let i = 0;
    let sql = `insert into items (id, by, text, time, type, parent, kids, url, title) values `;

    let sqlValues = []
    let values = [];

    batch.forEach((json, n) => {
        let i = n * 9 + 1;

        sqlValues.push(
            `($${i}, $${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${i + 5}, $${i + 6}, $${i + 7}, $${i + 8})`
        );


        values.push(json.id);
        values.push(json.by);
        values.push(json.text);
        values.push(new Date(json.time * 1000).toISOString().slice(0, 19));
        values.push(json.type);
        values.push(json.parent);
        values.push(json.kids && json.kids.join(' '));
        values.push(json.url);
        values.push(json.title);
    });

    return query(sql + sqlValues.join(','), values).then(() => {
        let ids = batch.map(b => b.id);

        return query(`update queue set done = true where id in (${ids.join(',')})`);
    });
}

function saveError(id, err) {
    query(`update items set done = true, error = $1 where id = ${id}`, [err.toString() + err.stack]);
}
