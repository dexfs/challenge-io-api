class CreateMovieAction {
  constructor (repository) {
    this.repository = repository
  }

  async execute (input) {
    const movie = await this.repository.create(input)
    return movie
  }
}

module.exports = CreateMovieAction
