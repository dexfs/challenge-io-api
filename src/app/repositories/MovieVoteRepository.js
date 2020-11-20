const AbstractRepository = require('./AbstractRepository')
const db = require('@orm/sequelize/sequelize')

class MovieVoteRepository extends AbstractRepository {
  constructor () {
    super()
    this.model = db.sequelize.model('movie_vote')
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
    return this.model.findByPk(`${id}`)
  }

  async all () {
    return this.model.findAll()
  }
}

module.exports = MovieVoteRepository
