const { Router } = require('express')
const { validate } = require('express-validation')
const isAuthorized = require('@app/middlewares/isAuthorized')
const isAdmin = require('@app/middlewares/isAdmin')
const UsersController = require('@app/http/users/controllers/UsersController')

const updateUserValidation = require('@app/http/requests/UpdateUserValidation')
const createUserValidation = require('@app/http/requests/CreateUserValidation')

const usersRouter = Router()

usersRouter.get('/', UsersController.index)
// usersRouter.get('/:username', UsersController.show)

usersRouter.post(
  '/register',
  validate(createUserValidation, {}, {}),
  UsersController.create
)

usersRouter.put(
  '/',
  isAuthorized,
  validate(updateUserValidation, {}, {}),
  UsersController.update
)

usersRouter.delete('/:userId', isAuthorized, isAdmin, UsersController.delete)

module.exports = usersRouter
