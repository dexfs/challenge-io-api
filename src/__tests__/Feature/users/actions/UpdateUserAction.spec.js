require('reflect-metadata')

const CreateUsersSeeder = require('@database/seeds/CreateUsersSeeder')
const UpdateUserAction = require('@app/actions/UpdateUserAction')
const UsersRepository = require('@app/repositories/UsersRepository')

const ServerFactory = require('../../../../server')

describe('UpdateUserAction', () => {
  beforeAll(async done => {
    await ServerFactory.connectionPGCreate()
    await useSeeding({ connection: 'test' })
    done()
  })
  beforeEach(async done => {
    await runSeeder(CreateUsersSeeder)
    done()
  })

  afterAll(async done => {
    await tearDownDatabase()
    done()
  })

  it('should update an user', async () => {
    const userRepository = getCustomRepository(UsersRepository)
    const action = new UpdateUserAction()
    const users = await userRepository.find()
    const user = users[Math.floor(Math.random() * users.length)]
    const userUpdate = {
      mobileToken: 'token_updated',
      id: user.id
    }
    await action.execute(userUpdate)

    const userUpdated = await userRepository.findOne({ id: user.id })

    expect(userUpdated).not.toBeNull()
    expect(userUpdated?.mobileToken).toBe(userUpdate.mobileToken)
  })

  it('should update the user password', async () => {
    const userRepository = getCustomRepository(UsersRepository)
    const action = new UpdateUserAction()
    const users = await userRepository.find()
    const user = users[Math.floor(Math.random() * users.length)]
    const userUpdate = {
      currentPassword: '12345678',
      newPassword: 'passwupdated',
      id: user.id
    }
    await expect(action.execute(userUpdate)).resolves.toBeTruthy()
  })
})
