const { compare } = require('bcryptjs')
const UserRepository = require('@app/repositories/UsersRepository')
const User = require('@app/entities/User')
const TokenService = require('@app/services/tokenService')
const { Unauthorized } = require('@app/exceptions/errors')
const AbstractAction = require('./ActionAbstract')
class AuthenticateAction extends AbstractAction {
  async execute ({ username, password }) {
    const { userRepository } = this.loadRepositories()
    const user = await userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password']
    })

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

  loadRepositories () {
    return {
      userRepository: getCustomRepository(UserRepository)
    }
  }
}

module.exports = AuthenticateAction
