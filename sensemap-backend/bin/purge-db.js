require('dotenv').config();
var knex = require('knex');

var i = process.env.DATABASE_URL.lastIndexOf('/');
var connection = process.env.DATABASE_URL.substr(0, i) + '/postgres';
var database_name = process.env.DATABASE_URL.substr(i + 1);

if (!process.env.DO_NOT_PROTECT_ME_FROM_MYSELF) {
  console.log(`
Running this script will purge all data in:

  - Database: ${database_name}
  - Server: ${connection}

If you really want to do this, make sure you can access the 'postgres' database, and run:

  DO_NOT_PROTECT_ME_FROM_MYSELF=1 purge-db.js
`);
  process.exit(-1);
}

var db = knex({
  client: 'pg',
  connection,
  //debug: true,
});

db.schema.raw(`DROP DATABASE ${database_name};`)
  .then(() => db.schema.raw(`CREATE DATABASE ${database_name};`))
  .then(() => console.log(`done purging ${database_name}`))
  .then(() => db.destroy());
