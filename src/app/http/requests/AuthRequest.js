const { Joi } = require('express-validation')

module.exports = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
}
