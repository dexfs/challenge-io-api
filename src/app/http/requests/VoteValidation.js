const { Joi } = require('express-validation')

module.exports = {
  body: Joi.object({
    value: Joi.number().required()
  })
}
