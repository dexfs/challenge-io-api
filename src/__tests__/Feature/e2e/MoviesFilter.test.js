require('jest-extended')
const TokenService = require('@app/services/tokenService')
const { startTestServer, clearDatabase, makeUser, makeMovie } = require('./../../__utils')
const ServerFactory = require('../../../server')
// const db = require('@orm/sequelize/sequelize')

const makeAuth = async (type) => {
  const tokenService = new TokenService()
  const user = await makeUser(type)
  const token = tokenService.generate(user)
  return token
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

  test('filter by name ', async done => {
    expect.assertions(2)
    const token = await makeAuth()
    await makeMovie({
      title: 'any title',
      genre: 'any genre',
      director: 'any director'
    })
    await makeMovie({
      title: 'Titanic',
      genre: 'romance',
      director: 'James Cameron'
    })

    const response = await request.get('/movies?filter[title]=Titanic')
      .set('Authorization', `bearer ${token}`)
    console.dir(response.body, { death: null })
    expect(response.status).toBe(200)
    expect(response.body[0].title).toBe('Titanic')
    done()
  })

  test('filter by director ', async done => {
    expect.assertions(2)
    const token = await makeAuth()
    await makeMovie({
      title: 'any title',
      genre: 'any genre',
      director: 'any director'
    })
    await makeMovie({
      title: 'Titanic',
      genre: 'romance',
      director: 'James Cameron'
    })

    const response = await request.get('/movies?filter[director]=James')
      .set('Authorization', `bearer ${token}`)
    console.dir(response.body, { death: null })
    expect(response.status).toBe(200)
    expect(response.body[0].director).toBe('James Cameron')
    done()
  })

  test('filter by genre ', async done => {
    expect.assertions(2)
    const token = await makeAuth()
    await makeMovie({
      title: 'any title',
      genre: 'any genre',
      director: 'any director'
    })
    await makeMovie({
      title: 'Titanic',
      genre: 'romance',
      director: 'James Cameron'
    })

    const response = await request.get('/movies?filter[genre]=romance')
      .set('Authorization', `bearer ${token}`)
    console.dir(response.body, { death: null })
    expect(response.status).toBe(200)
    expect(response.body[0].genre).toBe('romance')
    done()
  })
})
