const bcrypt = require('bcryptjs')
const VoteAction = require('@app/actions/VoteAction')
const MovieRepository = require('@app/repositories/MovieRepository')
const MovieVoteRepository = require('@app/repositories/MovieVoteRepository')
const { loadDb, disconnectDb, clearDatabase } = require('./../../__utils')
const db = require('@orm/sequelize/sequelize')

const makeAction = () => {
  const repository = new MovieVoteRepository()
  const action = new VoteAction(repository)
  return action
}
const makeMovie = async () => {
  const input = {
    title: 'any_title',
    genre: 'any_genre',
    director: 'any_director'
  }
  const movieRepository = new MovieRepository()
  return await movieRepository.create(input)
}

const makeUser = async () => {
  const input = {
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password',
    currentPassword: 'any_password',
    type: 'user'
  }
  const modelUser = db.sequelize.model('user')
  const passwordHash = await bcrypt.hash(input.password, 12)
  return await modelUser.create({ ...input, password: passwordHash })
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
    const movie = await makeMovie()
    const user = await makeUser()
    const action = makeAction()
    const result = await action.execute({
      movieId: movie.id,
      userId: user.id,
      value: 1
    })

    expect(result).not.toBeNull()
  })
})
