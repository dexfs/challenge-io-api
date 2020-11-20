const isAdmin = (
  request,
  response,
  next
) => {
  if (request.user.type !== 'admin') {
    return response.status(401).json({ message: 'Invalid user!' })
  } else {
    next()
  }
}

module.exports = isAdmin
