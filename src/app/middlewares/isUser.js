const isUser = (
  request,
  response,
  next
) => {
  if (request.user.type !== 'user') {
    return response.status(401).json({ message: 'Invalid user!' })
  } else {
    next()
  }
}

module.exports = isUser
