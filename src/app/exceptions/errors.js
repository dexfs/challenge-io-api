/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
class GeneralError extends Error {
  constructor (message) {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GeneralError)
    }

    this.name = 'GeneralError'
    this.message = message
  }

  getCode () {
    if (this instanceof BadRequest) {
      return 400
    }

    if (this instanceof Unauthorized) {
      return 401
    }

    if (this instanceof NotFound) {
      return 404
    }
    return 500
  }
}

class BadRequest extends GeneralError {}
class NotFound extends GeneralError {}
class Unauthorized extends GeneralError {
  constructor (message) {
    super(message)
    this.name = 'Unauthorized'
  }
}

module.exports = { GeneralError, BadRequest, NotFound, Unauthorized }
