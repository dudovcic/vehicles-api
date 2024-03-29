<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>


## Description

API for querying vehicle info. Vehicles can be queried via REST endpoint with :id and :timestmap params. Queried info is cached into Redis ( default TTL 60sec ).

`GET /vehicles/:vehicleId/:timestamp`

Example:
- GET http://localhost:3000/vehicles/3?time=2022-09-12T10:00:00Z


## Running the app via Docker

```bash
# Spin up the API + Postgres + Redis
$ docker-compose up

Once the container is up you can reach the API on port 3000:

- GET localhost:3000/vehicles/3?time=2022-09-12T10:00:00Z
```

## Database migrations

Prisma is used as an ORM, so migrations can be executed through it.

ie. inside a pipeline, make sure DATABASE_URL env is set as in .env.example and run:
```bash
npx prisma migrate deploy
```

Locally in development run:
```bash
npx prisma migrate dev
```

# Local setup

## Installation

```bash
$ yarn install
```
## Running the api locally

- Requires Postgres and Redis installed locally
- Rename .env.example to .env and adjust the values so you can connect to relevant stores
- `yarn` or `npm i`
- `yarn run start:dev` or `npm run start:dev`

## Test

```bash
# unit tests
$ yarn run test
```