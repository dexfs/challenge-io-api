const { Router } = require('express')
const { validate } = require('express-validation')
const MoviesController = require('@app/http/movies/controllers/MoviesController')
const isAuthorized = require('@app/middlewares/isAuthorized')
const isAdmin = require('@app/middlewares/isAdmin')
const isUser = require('@app/middlewares/isUser')
const createMovieValidation = require('@app/http/requests/CreateMovieValidation')
const voteValidation = require('@app/http/requests/VoteValidation')
const moviesRouter = Router()

moviesRouter.get(
  '/',
  isAuthorized,
  MoviesController.all
)

moviesRouter.post(
  '/',
  isAuthorized,
  isAdmin,
  validate(createMovieValidation, {}, {}),
  MoviesController.create
)

moviesRouter.post(
  '/:movieId/vote',
  isAuthorized,
  isUser,
  validate(voteValidation, {}, {}),
  MoviesController.vote
)

moviesRouter.get(
  '/:movieId',
  MoviesController.show
)

module.exports = moviesRouter
