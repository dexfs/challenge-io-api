class VoteAction {
  constructor (repository) {
    this.repository = repository
  }

  async execute (input) {
    const vote = await this.repository.create(input)
    return vote
  }
}

module.exports = VoteAction
