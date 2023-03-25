# nest-api
> Nest + Prisma + Postgres
## Installation

```bash
$ npm install
```

## Running the app
1. Copy `.env.example` file to `.env`
2. Run script:
```bash
$ docker-compose build --no-cache
$ docker-compose up -d
```
3. It will be running on PORT (from `.env` config), if whole config is like in `.env.example`: [now you can check Swagger](http://localhost:8000/docs)


## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
