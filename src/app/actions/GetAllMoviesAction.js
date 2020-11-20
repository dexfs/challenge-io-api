class GetAllMoviesAction {
  constructor (repository) {
    this.repository = repository
  }

  async execute (query) {
    console.dir(query)
    const movies = await this.repository.all(query)
    return await Promise.all(movies)
  }
}

module.exports = GetAllMoviesAction
