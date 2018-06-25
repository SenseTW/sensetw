var dotenv = require('dotenv');
dotenv.config();
var config = require('./config');

var Knex = require('knex');
var knex = Knex(
  !!process.env.NODE_ENV && process.env.NODE_ENV in config
    ? config[process.env.NODE_ENV]
    : {
      client: 'pg',
      connection: process.env.DATABASE_URL,
    });

knex.seed.run().spread(function (log) {
  if (log.length === 0) {
    console.log('No seed files exist');
    process.exit(0);
  }
  console.log(`Ran ${log.length} seed files \n${log.join('\n')}`);
  process.exit(0);
}).catch(function (err) {
  console.error(err);
  process.exit(-1);
});
