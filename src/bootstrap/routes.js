const { Router } = require('express')

const authRoutes = require('./../routes/auth.routes')
// const usersRoutes = require('../routes/users.routes');

const routes = Router()

routes.use('/authenticate', authRoutes)
// routes.use('/users', usersRoutes);

module.exports = routes
