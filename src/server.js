require('module-alias/register')
const express = require('express')
require('express-async-errors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const Sentry = require('@sentry/node')
const cors = require('cors')
const handleErrors = require('@app/middlewares/handleErrors')
const { loadEnv } = require('@bootstrap/loadEnvironments')
const routes = require('@bootstrap/routes')
const db = require('@orm/sequelize/sequelize')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

loadEnv()
class Server {
  constructor () {
    this.app = express()
    Sentry.init({ dsn: process.env.SENTRY_DSN })
    this.enableMiddlewares()
    this.loadRoutes()
    this.enableErrorHandlers()
  }

  logs () {
    // eslint-disable-next-line no-console
    console.log(`🌎 [envoriment]: ${process.env.NODE_ENV}`)
    // eslint-disable-next-line no-console
    // console.log(`📖 [database]: ${this.connection.isConnected}`);
    // eslint-disable-next-line no-console
    console.log(
      `🚀 Server ready at: http://${process.env.HOST}:${process.env.PORT}`
    )
  }

  async databaseConnect () {
    try {
      await db.sequelize.sync()
      console.log('Connection to DB has been established successfully.')
    } catch (err) {
      console.error('Unable to connect to the database:', err)
    }
  }

  async databaseCloseConnection () {
    try {
      await db.sequelize.close()
    } catch (err) {
      console.error('Unable to close the connection:', err)
    }
  }

  loadRoutes () {
    this.app.use(routes)
  }

  enableMiddlewares () {
    this.app.use(Sentry.Handlers.requestHandler())
    this.app.disable('x-powered-by')
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(helmet())
    this.app.use(limiter)
  }

  enableErrorHandlers () {
    this.app.use(handleErrors)
  }

  listen () {
    this.app.listen(process.env.PORT)
  }

  async start () {
    await this.databaseConnect()
    this.listen()
    this.logs()
  }
}

module.exports = new Server()
