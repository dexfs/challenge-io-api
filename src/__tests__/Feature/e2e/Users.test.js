require('jest-extended')
const { Op } = require('sequelize')
const { verify } = require('jsonwebtoken')
const authConfig = require('@config/auth')
const { startTestServer, clearDatabase, makeUser } = require('../../__utils')
const TokenService = require('@app/services/tokenService')
const ServerFactory = require('../../../server')
const db = require('@orm/sequelize/sequelize')

const makeAuth = async (type = 'user') => {
  const tokenService = new TokenService()
  const user = await makeUser(type)
  const token = tokenService.generate(user)
  return {
    token,
    user
  }
}

const decodeToken = (token) => {
  return verify(token, authConfig.jwt.secret)
}

describe('Users - e2e', () => {
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
    expect.assertions(2)

    const response = await request.post('/users/register').send({
      name: 'new_user',
      email: 'new_mail@mail.com',
      password: 'any_password',
      type: 'user'
    })
    const token = response.body.token
    const decoded = decodeToken(token)
    expect(response.status).toBe(201)
    expect(decoded.user.type).toBe('user')
    done()
  })

  test('Register user type admin ', async done => {
    expect.assertions(2)

    const response = await request.post('/users/register').send({
      name: 'new_user',
      email: 'new_mail@mail.com',
      password: 'any_password',
      type: 'admin'
    })
    const token = response.body.token
    const decoded = decodeToken(token)
    expect(response.status).toBe(201)
    expect(decoded.user.type).toBe('admin')
    done()
  })

  test('Update user', async done => {
    expect.assertions(2)
    const { token } = await makeAuth()

    const response = await request.put('/users').send({
      name: 'update_user_name'
    }).set('Authorization', `bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('update_user_name')
    done()
  })

  test('Delete user', async done => {
    expect.assertions(2)
    const { token } = await makeAuth('admin')
    const user = await makeUser()
    const response = await request.delete(`/users/${user.id}`)
      .set('Authorization', `bearer ${token}`)

    expect(response.status).toBe(200)

    const userTest = await db.sequelize.model('user').findOne({
      where: {
        id: user.id,
        deletedAt: {
          [Op.not]: null
        }
      },
      paranoid: false
    })
    expect(userTest).not.toBeNull()
    done()
  })
})
