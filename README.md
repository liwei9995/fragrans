<p align="center">
  <a href="https://www.oyiyio.com" target="blank"><img src="./public/logo/logo_fragrans.svg" width="160" alt="Fragrans Logo" /></a>
</p>

<p align="center">A <a href="http://nodejs.org" target="_blank">Node.js</a> project based on <a href="https://github.com/nestjs/nest" target="_blank">Nest</a> for building file storage service.</p>

## Description

Osmanthus fragrans Lour is my favorite flower, so I named this project fragrans. In my opinion, a distributed file storage system is composed of osmanthus-like flies scattered on the ground.

Fragrans aims to provide users the ability to deploy their own file storage service with efficiency and scalability.

## Preparation

```bash
# start mongodb
$ docker-compose -f docker-compose.develop.yaml up -d
```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

```bash
# build or rebuild services
$ docker-compose build

# run containers in the background
$ docker-compose up -d
```

## Stay in touch

- Author - [Aaron Li](https://www.oyiyio.com)

## License

Fragrans is [MIT licensed](LICENSE).
