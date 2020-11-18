import { Router } from 'express'
import { validate } from 'express-validation'

import isAuthorized from '@app/middlewares/isAuthorized'
import RoomsController from '@app/http/rooms/controllers/RoomsController'
import getInfoRoomValidation from '@app/http/requests/getInfoRoomValidation'
import createRoomValidation from '@app/http/requests/createRoomValidation'
import changeRoomHostValidation from '@app/http/requests/changeRoomHostValidation'
import roomIdValidation from '@app/http/requests/roomIdValidation'

const roomsRouter = Router()

roomsRouter.get(
  '/:roomId/info',
  validate(getInfoRoomValidation, {}, {}),
  RoomsController.show
)
roomsRouter.post(
  '/',
  isAuthorized,
  validate(createRoomValidation, {}, {}),
  RoomsController.create
)
roomsRouter.put(
  '/change-room-host',
  isAuthorized,
  validate(changeRoomHostValidation, {}, {}),
  RoomsController.update
)

roomsRouter.post(
  '/:roomId/join',
  isAuthorized,
  validate(roomIdValidation, {}, {}),
  RoomsController.join
)

roomsRouter.delete(
  '/:roomId/leave',
  isAuthorized,
  validate(roomIdValidation, {}, {}),
  RoomsController.leave
)

export default roomsRouter
