require('jest-extended')
const TokenService = require('@app/services/tokenService')
const { startTestServer, clearDatabase, makeUser, makeMovie } = require('./../../__utils')
const ServerFactory = require('../../../server')
const db = require('@orm/sequelize/sequelize')

const makeAuth = async (type) => {
  const tokenService = new TokenService()
  const user = await makeUser(type)
  const token = tokenService.generate(user)
  return token
}

const makeMovieAndVotes = async (user) => {
  const inputMovie = {
    title: 'any_title',
    genre: 'any_genre',
    director: 'any_director'
  }

  const modelMovie = db.sequelize.model('movie')

  const modelVote = db.sequelize.model('movie_vote')
  const movie = await modelMovie.create(inputMovie)
  await modelVote.create({
    movieId: movie.id,
    userId: user.id,
    value: 1
  })
  await modelVote.create({
    movieId: movie.id,
    userId: user.id,
    value: 4
  })
  return movie
}

describe('Movies - e2e', () => {
  let request

  beforeAll(async done => {
    await ServerFactory.databaseConnect()
    request = await startTestServer()
    done()
  })
  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async done => {
    await ServerFactory.databaseCloseConnection()
    done()
  })

  test('Register user type user ', async done => {
    expect.assertions(1)
    const tokenService = new TokenService()
    const user = await makeUser('admin')
    const token = tokenService.generate(user)
    const response = await request.post('/movies').send({
      title: 'any_title',
      genre: 'any_genre',
      director: 'any_director'
    }).set('Authorization', `bearer ${token}`)

    expect(response.status).toBe(201)
    done()
  })

  test('return 401 when no admin user sent', async done => {
    expect.assertions(1)
    const token = await makeAuth()
    const response = await request.post('/movies').send({
      title: 'any_title',
      genre: 'any_genre',
      director: 'any_director'
    }).set('Authorization', `bearer ${token}`)

    expect(response.status).toBe(401)
    done()
  })

  test('should vote in a movie', async done => {
    expect.assertions(1)
    const token = await makeAuth()
    const movie = await makeMovie({
      title: 'any_title',
      genre: 'any_genre',
      director: 'any_director'
    })

    const response = await request.post(`/movies/${movie.id}/vote`).send({
      value: 4
    }).set('Authorization', `bearer ${token}`)
    console.log('vote', response.body)
    expect(response.status).toBe(201)
    done()
  })

  test('should not register the vote if the user is admin', async done => {
    expect.assertions(1)
    const token = await makeAuth('admin')
    const movie = await makeMovie({
      title: 'any_title',
      genre: 'any_genre',
      director: 'any_director'
    })

    const response = await request.post(`/movies/${movie.id}/vote`).send({
      value: 4
    }).set('Authorization', `bearer ${token}`)

    expect(response.status).toBe(401)
    done()
  })

  test('should a movie by id', async done => {
    expect.assertions(2)
    const user = await makeUser('user')
    const movie = await makeMovieAndVotes(user)

    const response = await request.get(`/movies/${movie.id}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('averageVotes')
    done()
  })
})
