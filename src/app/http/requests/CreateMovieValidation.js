const { Joi } = require('express-validation')

module.exports = {
  body: Joi.object({
    title: Joi.string().required(),
    genre: Joi.string().required(),
    director: Joi.string().required()
  })
}
