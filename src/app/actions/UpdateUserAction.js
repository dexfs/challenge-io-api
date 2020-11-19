const { compare, hash } = require('bcryptjs')
const { BadRequest, NotFound } = require('@app/exceptions/errors')

class UpdateUserAction {
  constructor (repository) {
    this.repository = repository
  }

  async execute (userInput) {
    const {
      id,
      currentPassword,
      newPassword
    } = userInput

    const userFound = await this.repository.get(id)

    if (!userFound) {
      throw new NotFound('Oh no!, user not found')
    }

    if (currentPassword && !newPassword) {
      throw new BadRequest("It's necessary to pass a new password.")
    }

    if (currentPassword && newPassword) {
      const passwordHash = await this.verifyCurrentPasswordAndGenerateHash({
        user: userFound,
        currentPassword,
        newPassword
      })
      userInput.password = passwordHash
    } else {
      delete userInput.password
    }

    await this.repository.update(id, userInput)
    return await this.repository.get(id)
  }

  async verifyCurrentPasswordAndGenerateHash ({
    user,
    currentPassword,
    newPassword
  }) {
    const isCorrectPassword = await compare(currentPassword, user.password)
    if (!isCorrectPassword) {
      throw new BadRequest('Current password is not valid.')
    }
    return hash(newPassword, 12)
  }
}

module.exports = UpdateUserAction
