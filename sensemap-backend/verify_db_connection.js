require('dotenv').config();

const { Client } = require('pg');
const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString: connectionString,
});

client.database = "";
client.connectionParameters.database = "";

client.connect()
  .then(() => {
    console.log("connected");
    process.exit();
  })
  .catch(err => {
    console.error(err.stack);
    process.exit();
  });

