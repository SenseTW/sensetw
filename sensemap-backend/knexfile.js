module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://postgres:mysecret@localhost:5432/sensemap',
    seeds: {
      directory: './seeds/dev'
    }
  }
};
