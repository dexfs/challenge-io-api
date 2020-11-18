require('reflect-metadata')
require('jest-extended')
const { useSeeding, factory } = require('typeorm-seeding')
const supertest = require('supertest')
const User = require('@app/entities/User')
const TokenService = require('@app/services/tokenService')
const { startTestServer } = require('../../__utils')
const ServerFactory = require('../../../server')

describe('UserUpdate - e2e', () => {
  let request
  let users
  let tokenService

  beforeAll(async done => {
    await useSeeding({ connection: 'test' })
    await ServerFactory.connectionPGCreate()
    users = await factory(User)().createMany(5, { password: '654321' })
    request = await startTestServer()
    tokenService = new TokenService()
    done()
  })

  afterAll(async done => {
    await ServerFactory.connectionPGClose()
    done()
  })

  it('should update logged user', async done => {
    expect.assertions(3)
    let response

    const token = tokenService.generate(users[0])

    response = await request
      .put('/users')
      .set('Authorization', `bearer ${token}`)
      .send({
        currentPassword: '654321',
        newPassword: 'NEWPASS',
        mobileToken: 'update_e2e'
      })

    expect(response.status).toBe(200)

    response = await request.post('/authenticate').send({
      username: users[0].username,
      password: 'NEWPASS'
    })

    expect(response.status).toBe(200)
    expect(response.body.token).not.toBeEmpty()
    done()
  })

  it('should return 401 when the user is not authenticated', async done => {
    expect.assertions(1)

    const response = await request.put('/users').send({
      username: users[0].username,
      currentPassword: '654321',
      newPassword: 'SENHA_NOVA'
    })
    expect(response.status).toBe(401)
    done()
  })

  it('should return 400 when invalid payload is sent', async done => {
    expect.assertions(3)
    let response
    const token = tokenService.generate(users[0])

    response = await request
      .put('/users')
      .set('Authorization', `bearer ${token}`)
      .send({
        username: users[0].username,
        currentPassword: '654321',
        newPassword: 'SENHA_NOVA'
      })
    expect(response.status).toBe(400)

    response = await request
      .put('/users')
      .set('Authorization', `bearer ${token}`)
      .send({
        currentPassword: '',
        newPassword: 'SENHA_NOVA'
      })
    expect(response.status).toBe(400)

    response = await request
      .put('/users')
      .set('Authorization', `bearer ${token}`)
      .send({
        currentPassword: '654321',
        newPassword: ''
      })
    expect(response.status).toBe(400)

    done()
  })
})
