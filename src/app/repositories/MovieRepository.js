const AbstractRepository = require('./AbstractRepository')
const db = require('@orm/sequelize/sequelize')

const withAverageVotes = (movies) => {
  return movies.map(movie => {
    return getAverageVote(movie)
  })
}

const getAverageVote = async (movie) => {
  const totalVotes = movie.votes.length

  if (totalVotes > 0) {
    const sumVotes = movie.votes.reduce((acc, vote) => {
      acc += vote.value
      return acc
    }, 0)

    movie.averageVotes = sumVotes / totalVotes
  } else {
    movie.averageVotes = 0
  }
  return movie
}

class MovieRepository extends AbstractRepository {
  constructor () {
    super()
    this.model = db.sequelize.model('movie')
  }

  async create (input) {
    const movie = this.model.create(input)
    return movie
  }

  async update (id, input) {
    return this.model.update(input, { where: { id } })
  }

  async delete (id) {
    return this.model.destroy({ where: { id } })
  }

  async get (id) {
    const movie = await this.model.findOne({ where: { id: `${id}` }, include: 'votes' })

    const result = await getAverageVote(movie.toJSON())
    return result
  }

  async all () {
    const result = await this.model.findAll({ include: 'votes' })
    return withAverageVotes(result)
  }
}

module.exports = MovieRepository
