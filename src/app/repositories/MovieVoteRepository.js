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
}

module.exports = MovieVoteRepository
