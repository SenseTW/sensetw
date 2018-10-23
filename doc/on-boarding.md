---
title: Engineer on-boarding
---

[TOC]

Setup local development environment
===

There are three components to setup for local development:

* Sensemap frontend
* Web clipper
* Sensemap backend

The three components can be setup separately.  For example, to debug the backend, you don't need to setup the frontend and web clipper.  Likewise, to debug the frontend, you can set it up to use the production or staging backends so that you don't need to install backend dependencies.  The web clipper is also completely separated from the frontend.

## Setup backend

The codebase of backend is under the `sensemap-backend` directory.  You will need Node.js >= v8.9.4 and PostgreSQL >= 10 to run it.  Older versions of Node.js and PostgreSQL are not tested.

### Install Node.js

We recommend installing Node.js with [nvm](https://github.com/creationix/nvm).

```shell
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
$ nvm install 8.9.4
$ nvm alias default 8.9.4
```

### Install PostgreSQL

We recommend installing PostgreSQL with [Docker](https://www.docker.com/products/docker-desktop).

```shell
# Download and install Docker for your operating system with the above link.
$ docker run --name sensemap -e POSTGRES_PASSWORD=<some_passphrase> -p 5432:5432 -d postgres
$ docker run -it --rm --link sensemap:postgres postgres -h postgres -U postgres -c 'CREATE DATABASE "sensemap" with owner "postgres";'
```

### Run backend

Clone the gigantic repository `sensetw`, then

```shell
$ cd sensemap-backend
$ cp .env.default .env
# Edit DATABASE_URL and SESSION_SECRET in .env
$ npm i -g yarn
$ yarn
$ yarn migrate up
$ yarn dev
# Check <http://localhost:8000/graphql>
$ yarn test   # Run tests
```

### Entrypoints to backend codebase

The backend is an [Express](https://expressjs.com/) application with three main feature sets:

* GraphQL server for [Sensemap](http://sense.tw/) frontend.
* REST API server for web clipper, and serve the bundled web clipper code.
* OAuth 2 login service for Sensemap frontend and web clipper.

These feature sets, implemented as Express middlewares, reside in four subdirectories under `src`:

* `src/client`: serve bundle web clipper code.
* `src/hypothesis`: REST API server for web clipper.
* `src/login`: OAuth login service.
* `src/types`: GraphQL server for Sensemap frontend, and business logic for all data.

You can see how these middlewares are bound to the Express server in `src/index.ts`.  Most common resources for all feature sets such as database connections and environment variables can be found in `src/context.ts`.

### Data model and business logic

You need to be able to navigate around in `src/types` before doing any serious development for the backend.  There are 6 major entities in the data model of Sensemap:

* User: A user that can login and edit the maps.
* Map: A map in Sensemap.
* (Sense)Object: A object on a map, which could represent a card or a box.  They could be named SenseObject in some places in the codebase because of naming conflicts with JavaScript.
* Edge: An edge that connects two objects on a map.
* Card: A card in Sensemap.  Each card can be represented by multiple objects.
* Box: A box in Sensemap.  Each box can be represented by a single object, and can contain several objects.

There is also an Annotation data model to support web clipper features, and Transaction and History data models to abstract updates to data.

Their relevant code resides in a few places:

* Definitions in database: These are all in `src/types/sql.ts`.
* Definitions in GraphQL: These are in the relevant files under `src/types`.  For example the types related to Box are defined in the `typeDefs` variable in `src/types/box.ts`.
* Business logic for reading data: In the relevant files under `src/types`.  For example the reading logic for Box are the `boxesQuery` and `get*` functions in `src/types/box.ts`.
* Business logic for writing data: These are packaged in the abstraction of Transaction.

### Transaction and History

Transaction abstracts the change of states in Sensemap into the following workflow:

1. Create a transaction, which is a pure data object, with the information of the change.
2. Run the transaction, which issues a series of SQL statements to the database.
3. When the change is committed to the database, save the transaction result in the database.
4. Generate history data from the saved transaction and save it to the database.

The workflow is packaged into the `run` function in `src/types/transaction.ts`, with each step broken down into different subroutines:

* The code for step one is the interface of `src/types/transaction.ts` (all the exported functions in it).
* `runTransaction` handles step two.
* `saveTransaction` handles step three.
* `writeHistory` and `transactionToHistoryData` in `src/types/history.ts` handles step four.

`src/types/history.ts` also support the GraphQL service for querying history data.

The reason behind this design is explain in detail in [architecture](architecture.md).

## Setup frontend

## Setup web clipper

Development flow
===

As of release v0.3.x (late 2018) we use the following development flow:

* Most of the codebase is contained in one gigantic repository [SenseTW/sensetw](https://github.com/SenseTW/sensetw).
* All feature plans and bugs are listed in the [issues of the repository](https://github.com/SenseTW/sensetw/issues) with [milestones](https://github.com/SenseTW/sensetw/milestones), assigned to the developers working on them.
* Most changes are developed with [GitHub flow](https://guides.github.com/introduction/flow/), using feature branches, pull requests, code review, and a single master branch for release.
* Most changes are merged to the master [with rebase](https://www.atlassian.com/git/tutorials/merging-vs-rebasing).
* Database schema changes are managed by migrations.

## Feature branch

We use feature branch to manage our works:

* Create a new branch for the feature you are working on
* There is no rules for the branch names currently, unless you want to utilise the staging service.
* Rebase to master regularly.
* Force push and rebase are allowed for feature branches.  Force push and rebase are **not** allowed for master branch.

A staging service is setup for the feature branches.  For every branch `BRANCH_NAME` in the repository, a Sensemap instance is automatically setup for testing with the following URLs:

* Frontend: <https://BRANCH_NAME.staging.sense.tw/>
* Backend: <https://BRANCH_NAME.staging.api.sense.tw/>

Each of the staging services has a separate database, and all of them are separated from the production database.  Special concerns regarding database migration is described in its own section in this document.

## Pull request and code review

For feature branches containing "major" changes, code review is recommended before merging.  Code review is strongly recommended for features containing database migrations.

We use GitHub pull requests to manage code review:

* For a branch to go through code review, create a pull request for it.
* Discuss with your peer about the branch.  Make relevant changes.  Rebase and force push if needed.
* Rebase to master and merge when the branch is ready.


## Release

A staging service is setup for the master branch with the following URLs:

- Frontend: <https://staging.sense.tw/>
- Backend: <https://staging.api.sense.tw/>

The staging service is rebuilt with every new commits to the master branch.

The master branch is deployed to <https://sense.tw/> and <https://api.sense.tw/> only when a new release tag is pushed to the repository.  The format of the release tag is `vMAJOR.MINOR.PATCH`, loosely following [semantic versioning](https://semver.org/).

The database of the staging service is separated from the production database.  Special concerns regarding database migration is described in its own section in this document.

## Database migration

Migrations in Sensemap backend is organised with [node-pg-migrate](https://www.npmjs.com/package/node-pg-migrate):

```sh
$ yarn migrate up   # Run migrations to the latest
$ yarn migrate down # Rollback one migration
# Create a new migration template in migrations directory
$ yarn migrate create my awesome change to db -j ts
```

Regarding the staging service and production service, migrations are currently handled as follows:

* For each of the staging services, migrations are run against a copy of the production database the moment when a new service is spawned.
* For the production services, migrations are run against the production database when a new release is deployed.

This basically means the migrations and databases of each branch are all separated, so you are free to work with migrations in your feature branch in any way.

However, when merging to the master, care must be taken on the order of migrations.  You must ensure every one of your migrations has a timestamp **after** all the migrations on the master branch, otherwise the service will fail to deploy.
