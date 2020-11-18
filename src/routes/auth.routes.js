const { Router } = require('express')
const { validate } = require('express-validation')

const IndexController = require('@app/http/auth/controllers/IndexController')
const authValidation = require('@app/http/requests/AuthRequest')

const authRouter = Router()

authRouter.post(
  '/',
  validate(authValidation, {}, {}),
  IndexController.authenticate
)

authRouter.get(
  '/',
  function (req, res) {
    return res.json({ data: 'ok' })
  }
)

module.exports = authRouter
