# Challenge
## ❯ Table of contents

- [Requirements](#-requirements)
- [Libraries](#-libraries)
- [Installation](#-installation)
- [Enviroment file](#-environment-file)
- [Running the app](#-running-the-app)
- [Tests](#-tests)

- [Routes and Payloads](#-routes-and-payloads)

## ❯ Introduction

This project is for Video Server Challenge
It's an API for handle users and video rooms.

## ❯ Requirements

- [Node.js](https://nodejs.org/en/)
- npm
- [PostgresSQL](https://www.postgresql.org/download/)
- [Docker(optional)](https://docs.docker.com/get-docker/)

## ❯ Libraries
- [Express](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)
- [Jest](https://expressjs.com/)
- [Jest Extended](https://github.com/jest-community/jest-extended)
- [standardjs](https://standardjs.com/)
-

## ❯ Installation

```bash
$ npm
```

Database with docker

```
$ docker-compose up -d
```
> It will create 2 containers with app database and test database.

## ❯ Enviroment file

create .env file
```bash
$ cp .env.example .env.dev
```
> the .env.example is with database info to run the project with docker.
## ❯ Running the app

```bash
# development
$ npm run dev
```
## ❯ Running the app with Docker
```bash
# development
$ docker-compose up -d

# OR with visible logs
$ docker-compose up
```



## ❯ Tests

```bash
# running unit tests
$ npm run test:unit

# running integration tests
$ npm run test:integration

# running ci
$ npm run test:ci

# running all tests
$ npm test
```

### For Authenticated routes you need pass a token

```json
{
  "Authorization": "Bearer <token>",
}
```

> There is a postman collection file in the /docs directory


