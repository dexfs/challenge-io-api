require('jest-extended')
const { startTestServer, makeUser } = require('./../../__utils')

const ServerFactory = require('../../../server')

describe('Auth - e2e', () => {
  let request

  beforeAll(async done => {
    await ServerFactory.databaseConnect()
    request = await startTestServer()
    done()
  })

  afterAll(async done => {
    await ServerFactory.databaseCloseConnection()
    done()
  })

  test('SignIn - Valid', async done => {
    await makeUser()
    expect.assertions(2)

    const response = await request.post('/authenticate').send({
      email: 'any_mail@mail.com',
      password: 'any_password'
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String)
      })
    )
    done()
  })

  test('SignIn - Invalid', async done => {
    expect.assertions(1)

    const response = await request.post('/authenticate').send({
      username: 'a',
      password: '65432'
    })
    expect(response.status).toBe(400)
    done()
  })
})
