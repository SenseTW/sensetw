
Installation
===

```
$ yarn
# edit `.env` or set DATABASE_URL environment variable
$ yarn run migrate up
$ yarn start
```

Development
===

## Create a migration

```
# creates `migrations/<timestamp>_My-Awesome-Migration.ts`
$ yarn run migrate create My Awesome Migration -j ts
```
