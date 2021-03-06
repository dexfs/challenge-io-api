const AbstractRepository = require('./AbstractRepository')
const db = require('@orm/sequelize/sequelize')
class UsersRepository extends AbstractRepository {
  constructor () {
    super()
    this.model = db.sequelize.model('user')
  }

  async create (input) {
    const user = this.model.create(input)
    return user
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

  async findByEmail (email) {
    const query = { where: { email } }

    return this.model.findOne(query)
  }

  async findByUsername (
    name
  ) {
    const query = { where: { name } }

    return this.model.findOne(query)
  }
}

module.exports = UsersRepository
