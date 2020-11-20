const { Router } = require('express')

const authRoutes = require('./../routes/auth.routes')
const usersRoutes = require('../routes/users.routes')
const moviesRoutes = require('../routes/movies.route')

const routes = Router()

routes.use('/authenticate', authRoutes)
routes.use('/users', usersRoutes)
routes.use('/movies', moviesRoutes)

module.exports = routes
