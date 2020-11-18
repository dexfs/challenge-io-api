require('reflect-metadata')
const CreateUserAction = require('@app/actions/CreateUserAction')
const ServerFactory = require('../../../../server')

describe('CreateUserAction', () => {
  beforeAll(async () => {
    await ServerFactory.connectionPGCreate()
  })

  afterAll(async () => {
    await ServerFactory.connectionPGClose()
  })

  it('should create an user and return user and token', async () => {
    const action = new CreateUserAction()
    const result = await action.execute({
      username: '__TEST__',
      password: '123456'
    })

    expect(result).toHaveProperty('token')
    expect(result.token).not.toBeNull()
  })

  it('should return and error if invalid data passed', async () => {
    const action = new CreateUserAction()
    const data = { username: '', password: '' }
    await expect(action.execute(data)).rejects.toBeTruthy()
  })
})
