const CreateMovieAction = require('@app/actions/CreateMovieAction')
const MovieRepository = require('@app/repositories/MovieRepository')
const { loadDb, disconnectDb } = require('./../../__utils')
const db = require('@orm/sequelize/sequelize')

const clearDatabase = async () => {
  const model = db.sequelize.model('user')
  await model.destroy({
    truncate: true
  })
}

const makeAction = () => {
  const movieRepository = new MovieRepository()
  const action = new CreateMovieAction(movieRepository)
  return action
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

  it('should create an movie info', async () => {
    const action = makeAction()
    const result = await action.execute({
      title: 'any_title',
      genre: 'any_genre',
      director: 'any_director'
    })

    expect(result.title).toBe('any_title')
    expect(result.genre).toBe('any_genre')
    expect(result.director).toBe('any_director')
  })

  it('should return and error if invalid data passed', async () => {
    const action = makeAction()
    const data = {
      title: '',
      genre: '',
      director: ''
    }

    const promise = action.execute(data)
    await expect(promise).rejects.toThrow()
  })
})
