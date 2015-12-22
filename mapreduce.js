import {query} from './db';
import fs from 'fs';

const BATCH_SIZE = 10000;

async function occurences({regex, filename}) {
    let {rows} = await query(`select count(*) from items where type = 'comment'`);
    let count = rows[0].count;
    let offset = 0;
    let result = [];

    console.log({count});

    while (offset + BATCH_SIZE < count) {
        console.log({offset});
        let {rows} = await query(`select * from items limit ${BATCH_SIZE} offset ${offset}`);
        offset += BATCH_SIZE;

        rows.forEach(row => {
            if (row.text && row.text.match(regex)) {
                result.push(row);
            }
        });
    }

    console.log({matches: result.length});

    fs.writeFileSync('result.txt', JSON.stringify(result, null, 2));
}
