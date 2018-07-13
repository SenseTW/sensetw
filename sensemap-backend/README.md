# Avaliable Scripts
- yarn run start :: run development server.

# Tech Architecture 
- Yarn :: Fast, reliable, and secure dependency management for JavaScript.
- TypeScript :: A programming language designed for large-scale JavaScript application with optional static type-checking along with the latest ECMAScript features.
- React :: A JavaScript library for building user interfaces.
- GraphQL :: A query language for APIs and a runtime for fulfilling those queries with your existing data.
- SemanticUI :: A development framework that helps create beautiful, responsive layouts using human-friendly HTML.

# License
MIT.

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
