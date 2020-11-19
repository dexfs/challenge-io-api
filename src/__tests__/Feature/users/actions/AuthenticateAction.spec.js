const bcrypt = require('bcryptjs')
const AuthenticateAction = require('@app/actions/AuthenticateAction')
const UsersRepository = require('@app/repositories/UsersRepository')
const { loadDb, disconnectDb, clearDatabase } = require('./../../../__utils')
const db = require('@orm/sequelize/sequelize')

const makeUser = async (input) => {
  const modelUser = db.sequelize.model('user')
  const passwordHash = await bcrypt.hash(input.password, 12)
  return await modelUser.create({ ...input, password: passwordHash })
}

describe('AuthenticateAction', () => {
  beforeAll(async () => {
    await loadDb()
  })

  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  it('should login in and return the token', async () => {
    const userData = {
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
      currentPassword: 'any_password',
      type: 'user'
    }
    const { email, password } = userData
    await makeUser(userData)
    const userRepository = new UsersRepository()
    const action = new AuthenticateAction(userRepository)
    const result = await action.execute({
      email, password
    })

    expect(result).toHaveProperty('token')
    expect(result.token).not.toBeNull()
  })

  it('should throw an exception with invalid email', async () => {
    const userRepository = new UsersRepository()
    const action = new AuthenticateAction(userRepository)
    const result = action.execute({
      email: 'invalid_email', password: 'any_password'
    })

    await expect(result).rejects.toThrow()
  })

  it('should throw an exception an invalid password is sent', async () => {
    const userData = {
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
      currentPassword: 'any_password',
      type: 'user'
    }
    const { email } = userData
    await makeUser(userData)
    const userRepository = new UsersRepository()
    const action = new AuthenticateAction(userRepository)
    const result = action.execute({
      email, password: 'invalid_password'
    })

    await expect(result).rejects.toThrow()
  })
})
