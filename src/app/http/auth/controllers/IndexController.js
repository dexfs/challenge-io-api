const AuthenticateAction = require('@app/actions/AuthenticateAction')
const UsersRepository = require('@app/repositories/UsersRepository')
class IndexController {
  static async authenticate (request, response) {
    const userRepository = new UsersRepository()
    const authenticateAction = new AuthenticateAction(userRepository)
    const { token } = await authenticateAction.execute(request.body)
    return response.json({ token })
  }
}

module.exports = IndexController
