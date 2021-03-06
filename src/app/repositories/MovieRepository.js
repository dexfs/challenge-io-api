const AbstractRepository = require('./AbstractRepository')
const db = require('@orm/sequelize/sequelize')
const { Op } = require('sequelize')

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

const buildQuery = (query) => {
  const where = {}
  if (!query?.filter) return null
  Object.entries(query.filter).map(([field, value], key) => {
    console.log(field, value)
    where[field] = {
      [Op.substring]: value
    }
    return where
  })

  if (Object.values(where).length > 0) {
    return { where }
  }

  return null
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
    const movie = await this.model.findOne({ where: { id: `${id}` }, include: ['votes', 'cast'] })

    const result = await getAverageVote(movie.toJSON())
    return result
  }

  async all (query = null) {
    const filter = buildQuery(query)
    console.dir(filter)
    const result = await this.model.findAll({ ...filter, include: ['votes', 'cast'] })
    return result
  }
}

module.exports = MovieRepository
