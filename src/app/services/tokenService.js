const { sign, verify } = require('jsonwebtoken')
const authConfig = require('@config/auth')

class TokenService {
  generate (subject) {
    const { secret, expiresIn } = authConfig.jwt
    const { name, email, type, id } = subject
    const token = sign({ user: { name, email, type, id } }, secret, {
      expiresIn
    })

    return token
  }

  decrypt (token) {
    const decoded = verify(token, authConfig.jwt.secret)
    return decoded
  }
}

module.exports = TokenService
