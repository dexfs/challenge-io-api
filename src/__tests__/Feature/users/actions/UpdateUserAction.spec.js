const bcrypt = require('bcryptjs')
const UpdateUserAction = require('@app/actions/UpdateUserAction')
const UsersRepository = require('@app/repositories/UsersRepository')
const db = require('@orm/sequelize/sequelize')

const { loadDb, disconnectDb, clearDatabase } = require('./../../../__utils')

const makeUser = async (input) => {
  const modelUser = db.sequelize.model('user')
  const passwordHash = await bcrypt.hash(input.password, 12)
  return await modelUser.create({ ...input, password: passwordHash })
}

describe('UpdateUserAction', () => {
  beforeAll(async () => {
    await loadDb()
  })

  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  it('should update an user', async () => {
    const userData = {
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
      currentPassword: 'any_password',
      type: 'user'
    }
    const userTest = await makeUser(userData)
    const userRepository = new UsersRepository()
    const action = new UpdateUserAction(userRepository)

    await action.execute({ ...userTest.toJSON(), name: 'update_name' })

    const userUpdated = await userRepository.get(userTest.id)
    expect(userUpdated.toJSON()).not.toBeNull()
    expect(userUpdated.name).toBe('update_name')
    expect(userUpdated.password).not.toBe('any_password')
  })

  it('should update the user password', async () => {
    const userData = {
      name: 'any_name',
      email: 'any_mail@mail.com',
      password: 'any_password',
      type: 'user'
    }

    const userTest = await makeUser(userData)

    const userRepository = new UsersRepository()
    const action = new UpdateUserAction(userRepository)
    const userUpdate = {
      currentPassword: 'any_password',
      newPassword: 'passwupdated',
      id: userTest.id
    }
    const result = await action.execute(userUpdate)
    const isChangedPassword = await bcrypt.compare(userUpdate.newPassword, result.password)
    expect(isChangedPassword).toBe(true)
  })
})
