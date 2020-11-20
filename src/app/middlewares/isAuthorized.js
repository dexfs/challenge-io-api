const { verify } = require('jsonwebtoken')
const authConfig = require('@config/auth')

const decodeToken = (token) => {
  return verify(token, authConfig.jwt.secret)
}

const isAuthorized = (
  request,
  response,
  next
) => {
  const requestToken = request.headers.authorization

  if (!requestToken) {
    return response.status(401).json({ message: 'Missing token.' })
  }

  try {
    const [, token] = requestToken.split(' ')
    const decoded = decodeToken(token)
    request.user = decoded.user
    next()
  } catch (error) {
    return response.status(401).json({ message: 'Invalid token!' })
  }
}

module.exports = isAuthorized
