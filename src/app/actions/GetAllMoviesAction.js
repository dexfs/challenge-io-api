class GetAllMoviesAction {
  constructor (repository) {
    this.repository = repository
  }

  async execute () {
    const movie = await this.repository.all()
    return movie
  }
}

module.exports = GetAllMoviesAction
