const bcrypt = require('bcryptjs')
const supertest = require('supertest')
const ServerFactory = require('../server')
const db = require('@orm/sequelize/sequelize')
const CreateMovieAction = require('@app/actions/CreateMovieAction')
const MovieRepository = require('@app/repositories/MovieRepository')

/**
 * e2e Testing utils
 */
const startTestServer = async () => {
  return supertest(ServerFactory.app)
}

const loadDb = async () => {
  try {
    await db.sequelize.sync()
    console.log('Connection to DB has been established successfully.')
  } catch (err) {
    console.error('Unable to connect to the database:', err)
  }
}

const disconnectDb = async () => {
  try {
    await db.sequelize.close()
    console.log('Connection to DB has been established successfully.')
  } catch (err) {
    console.error('Unable to connect to the database:', err)
  }
}

const clearDatabase = async () => {
  const models = ['user', 'movie', 'movie_vote']
  for (const modelName of models) {
    const model = db.sequelize.model(modelName)
    await model.destroy({
      truncate: true,
      paranoid: false
    })
  }
}

const makeUser = async (type) => {
  const input = {
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password',
    currentPassword: 'any_password',
    type: type || 'user'
  }
  const modelUser = db.sequelize.model('user')
  const passwordHash = await bcrypt.hash(input.password, 12)
  return await modelUser.create({ ...input, password: passwordHash })
}

const makeMovie = async (input) => {
  const movieRepository = new MovieRepository()
  const action = new CreateMovieAction(movieRepository)
  return await action.execute(input)
}

module.exports = { startTestServer, loadDb, disconnectDb, clearDatabase, makeUser, makeMovie }
