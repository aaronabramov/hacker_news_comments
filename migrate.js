// migrate.js
var path = require('path');

require('sql-migrations').run({
    basedir: __dirname,
    migrationsDir: path.resolve(__dirname, './migrations'),
    user: 'dabramov',
    host: 'localhost',
    password: 'password', // YAY!!
    db: 'corpus'
});
