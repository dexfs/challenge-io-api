const bcrypt = require('bcryptjs')
const DeleteUserAction = require('@app/actions/DeleteUserAction')
const UsersRepository = require('@app/repositories/UsersRepository')
const { loadDb, disconnectDb, clearDatabase } = require('./../../__utils')
const db = require('@orm/sequelize/sequelize')

const makeUser = async (input) => {
  const modelUser = db.sequelize.model('user')
  const passwordHash = await bcrypt.hash(input.password, 12)
  return await modelUser.create({ ...input, password: passwordHash })
}

describe('DeleteUserAction', () => {
  beforeAll(async () => {
    await loadDb()
  })

  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  it('should delete an user passed', async () => {
    const userData = {
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
      currentPassword: 'any_password',
      type: 'user'
    }

    const userData2 = {
      name: 'any_name_2',
      email: 'any_mail_2@mail.com',
      password: 'any_password_2',
      currentPassword: 'any_password_2',
      type: 'user'
    }

    makeUser(userData)
    const userTest = await makeUser(userData2)
    const userRepository = new UsersRepository()
    const action = new DeleteUserAction(userRepository)

    await action.execute({ id: userTest.id })
    const userNotFound = await userRepository.get(userTest.id)
    const users = await userRepository.all()

    expect(userNotFound).toBeNull()
    expect(users.length).toBe(1)
  })

  it('should throw an error when invalid uuid passed', async () => {
    const userRepository = new UsersRepository()
    const action = new DeleteUserAction(userRepository)
    const result = action.execute({ id: '1' })
    await expect(result).rejects.toThrow()
  })
})
