// const AuthenticateAction = require('@app/actions/AuthenticateAction');

class IndexController {
  static async authenticate (request, response) {
    // const authenticateAction = new AuthenticateAction();
    // const { token } = await authenticateAction.execute(request.body);
    // return response.json({ token });
    return response.json({ ok: 'ok' })
  }
}

module.exports = IndexController
