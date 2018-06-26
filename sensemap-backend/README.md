
Installation
===

```
$ yarn
# edit `.env` or set DATABASE_URL environment variable
$ yarn run migrate up
$ yarn start
```

## Configuration

* `knexfile.js` are used by Knex CLI commands such as seeding.
* You can put environmental variables in `.env`.

Development
===

## Environment

There are 3 types of settings: development (local), staging, production.

* `NODE_ENV=developemnt` will default to use localhost PostgreSQL.

You can use `NODE_ENV` to choose a setting from `knexfile.js`:

```
NODE_ENV=development node dist
```

Or you can simply set DATABASE_URL (not in seed):

```
DATABASE_URL=postgres://localhost:5432/mydb node dist
```

You can add create a `.env` file in project root to specify environment variables.

## Create a migration

```
# creates `migrations/<timestamp>_My-Awesome-Migration.ts`
$ yarn run migrate create My Awesome Migration -j ts
```
