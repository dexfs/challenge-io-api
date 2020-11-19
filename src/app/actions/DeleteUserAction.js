class DeleteUserAction {
  constructor (repository) {
    this.repository = repository
  }

  async execute ({ id }) {
    await this.repository.delete(id)
  }
}

module.exports = DeleteUserAction
