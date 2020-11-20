const { NotFound } = require('@app/exceptions/errors')

class UpdateUserAction {
  constructor (repository) {
    this.repository = repository
  }

  async execute (userInput) {
    const {
      id
    } = userInput

    const userFound = await this.repository.get(id)

    if (!userFound) {
      throw new NotFound('Oh no!, user not found')
    }

    await this.repository.update(id, userInput)
    return await this.repository.get(id)
  }
}

module.exports = UpdateUserAction
