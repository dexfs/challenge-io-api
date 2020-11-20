const { Joi } = require('express-validation')

module.exports = {
  body: Joi.object({
    name: Joi.string().optional()
  })
}
