const { Joi } = require('express-validation')

module.exports = {
  body: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  })
}
