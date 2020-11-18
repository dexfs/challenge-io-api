import { Router } from 'express'
import { validate } from 'express-validation'
import isAuthorized from '@app/middlewares/isAuthorized'
import UsersController from '@app/http/users/controllers/UsersController'
import UserRoomsController from '@app/http/users/controllers/UserRoomsController'

import updateUserValidation from '@app/http/requests/updateUserValidation'
import createUserValidation from '@app/http/requests/createUserValidation'

const usersRouter = Router()

usersRouter.get('/', UsersController.index)
usersRouter.get('/:username/rooms', UserRoomsController.index)
usersRouter.get('/:username', UsersController.show)

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

usersRouter.delete('/', isAuthorized, UsersController.delete)

export default usersRouter
