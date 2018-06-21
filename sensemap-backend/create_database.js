require('dotenv').config();

const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString: connectionString,
});

const dbName = client.database;
var sql = `CREATE DATABASE ${client.database}`;
client.database = "";
client.connectionParameters.database = "";

client.connect()
  .then(() => {
    client.query(sql, (err) => {
      client.end();

      if (err) {
        if (err.code === "42P04") console.log(`Database ${dbName} already exists`);
        else console.log(err);
      } else {
        console.log(`Database ${dbName} created`);
      }

      process.exit();
    });
  })
  .catch(err => {
    console.log("Connection Error");
    process.exit();
  });

