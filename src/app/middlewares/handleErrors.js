const { Request, Response, NextFunction } = require('express')
const { ValidationError } = require('express-validation')
const { GeneralError } = require('@app/exceptions/errors')

module.exports = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: err.name,
      message: err.message
    })
  }

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }

  return res.status(500).json({
    status: 'error',
    message: err.message
  })
  next(err)
}
