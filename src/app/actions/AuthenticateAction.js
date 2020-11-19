const { compare } = require('bcryptjs')
const TokenService = require('@app/services/tokenService')
const { Unauthorized } = require('@app/exceptions/errors')

class AuthenticateAction {
  constructor (repository) {
    this.repository = repository
  }

  async execute ({ email, password }) {
    const user = await this.repository.findByEmail(email)

    if (!user) {
      throw new Unauthorized('Your username and/or password do not match.')
    }

    const isCorrectPassword = await compare(password, user.password)

    if (!isCorrectPassword) {
      throw new Unauthorized('Your username and/or password do not match.')
    }

    const tokenService = new TokenService()
    const token = tokenService.generate(user)
    return {
      token
    }
  }
}

module.exports = AuthenticateAction
