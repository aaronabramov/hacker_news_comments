import {populateDb, fetchBatch, fetchInBatches} from './crawler';

// populateDb(100).then(() => {
//     console.log('done');
// }).catch((err) => {
//     console.error(err);
// }).then(() => {
//     prosses.exit();
// });

fetchInBatches().then(() => {
    console.log('YO YO DONE');
}).catch((err) => {
    console.err(err);
});

//
//
// function fetchItem(id) {
//
//         return new Promise(() => {
//             if (err) {
//                 throw err;
//             }
//
//             let json = JSON.parse(response.body);
//
//             console.log({json, body: response.body, id});
//
//             return query(`
//                 insert into items (id, by, text, time, type, parent, kids, url, title, score)
//                 values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
//                 `,
//                 [
//                     json.id,
//                     json.by,
//                     json.text,
//                     new Date(json.time * 1000).toISOString().slice(0, 19),
//                     json.type,
//                     json.parent,
//                     json.kids && json.kids.join(' '),
//                     json.url,
//                     json.title,
//                     json.score
//                 ]).then(() => {
//                     return query(`update queue set done = true where id = $1`, [json.id]);
//                 }).then(() => {
//                     // return query(`select id from queue where id in (${json.kids.join(',')})`).then((result) => {
//                     //     let ids = result.rows.map(r => r.id);
//                     //
//                     //     let unqueued = _.without.apply(_, [json.kids, ...ids]);
//                     //     console.log({ids, unqueued});
//                     //
//                     //     if (!unqueued.length) {
//                     //         return;
//                     //     }
//                     //     let values = unqueued.map(id => `(${id})`).join(',');
//                     //
//                     //     return query(`insert into queue (id) values ${values}`);
//                     // });
//                 });
//             }).catch(err => {
//                     return query(
//                         `update queue set done = true, error = $1 where id = ${id}`,
//                         [err.toString() + err.stack]
//                     );
//             });
//     });
// }
//
// let queue;
//
// query(`select id from queue where done != true limit 500000`).then((result) => {
//     queue = result.rows.map(r => r.id).reverse();
//     setInterval(fetchNext, 68);
// });
//
// function fetchNext() {
//     let id = queue.shift();
//
//     if (!id) {
//         console.log('all done');
//         process.exit();
//     }
//
//     fetchItem(id);
// }
//
// // fetchItem(1);
// // fetchNext();
//
// // setInterval(fetchNext, 1000);
// // let a = [...Array(1000000)].map((_, i) => `(${i + 500000})`);
// //
// // query(`insert into queue (id) values ${a.join(',')}`).then(() => {
// //     console.log('DONE');
// // }).catch(err => {
// //     console.error(err);
// // });
