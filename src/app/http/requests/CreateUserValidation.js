const { Joi } = require('express-validation')

module.exports = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    type: Joi.string().required()
  })
}
