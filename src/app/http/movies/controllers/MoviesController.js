const MovieRepository = require('@app/repositories/MovieRepository')
const MovieVoteRepository = require('@app/repositories/MovieVoteRepository')
const CreateMovieAction = require('@app/actions/CreateMovieAction')
const VoteAction = require('@app/actions/VoteAction')

const movieRepository = new MovieRepository()
const movieVoteRepository = new MovieVoteRepository()
class MoviesController {
  static async create (request, response) {
    const action = new CreateMovieAction(movieRepository)
    const movie = await action.execute(request.body)
    return response.status(201).json(movie)
  }

  static async show (request, response) {
    const movie = await movieRepository.get(request.params.movieId)
    return response.status(200).json(movie)
  }

  static async vote (request, response) {
    const params = {
      movieId: request.params.movieId,
      userId: request.user.id,
      value: request.body.value
    }
    const action = new VoteAction(movieVoteRepository)
    const movie = await action.execute(params)
    return response.status(201).json(movie)
  }
}

module.exports = MoviesController
