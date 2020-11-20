const CreateUserAction = require('@app/actions/CreateUserAction')
const UsersRepository = require('@app/repositories/UsersRepository')
const { loadDb, disconnectDb } = require('../../__utils')
const db = require('@orm/sequelize/sequelize')

const clearDatabase = async () => {
  const model = db.sequelize.model('user')
  await model.destroy({
    truncate: true
  })
}

describe('CreateUserAction', () => {
  beforeAll(async () => {
    await loadDb()
  })

  beforeEach(async () => {
    await clearDatabase()
  })

  afterAll(async () => {
    await disconnectDb()
  })

  it('should create an type user and return the token', async () => {
    const userRepository = new UsersRepository()
    const action = new CreateUserAction(userRepository)
    const result = await action.execute({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      type: 'user'
    })

    expect(result).toHaveProperty('token')
    expect(result.token).not.toBeNull()
  })

  it('should create an type admin and the token', async () => {
    const userRepository = new UsersRepository()
    const action = new CreateUserAction(userRepository)
    const result = await action.execute({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      type: 'admin'
    })

    expect(result).toHaveProperty('token')
    expect(result.token).not.toBeNull()
  })

  it('should return and error if invalid data passed', async () => {
    const userRepository = new UsersRepository()
    const action = new CreateUserAction(userRepository)
    const data = {
      name: '',
      email: '',
      password: '',
      type: ''
    }
    await expect(action.execute(data)).rejects.toBeTruthy()
  })
})
