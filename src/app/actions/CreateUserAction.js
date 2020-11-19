const bcrypt = require('bcryptjs')
const TokenService = require('../../../src/app/services/tokenService')
const { GeneralError } = require('../../../src/app/exceptions/errors')
class CreateUserAction {
  constructor (repository) {
    this.repository = repository
  }

  async execute ({
    name,
    email,
    password,
    type
  }) {
    const userExists = await this.repository.findByEmail(email)

    if (userExists) {
      throw new GeneralError('Oh no!, this user already exists')
    }

    const encryptedPassword = await bcrypt.hash(password, 12)

    const user = await this.repository.create({
      name,
      email,
      password: encryptedPassword,
      type
    })

    const tokenService = new TokenService()
    const token = tokenService.generate(user)
    return {
      token
    }
  }
}

module.exports = CreateUserAction
