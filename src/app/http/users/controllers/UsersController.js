const CreateUserAction = require('@app/actions/CreateUserAction')
const UpdateUserAction = require('@app/actions/UpdateUserAction')
const DeleteUserAction = require('@app/actions/DeleteUserAction')
// const GetUserByUsername = require('@app/actions/GetUserByUsername')

const UsersRepository = require('@app/repositories/UsersRepository')
const userRepository = new UsersRepository()
class UsersController {
  static async index (request, response) {
    const usersRepository = new UsersRepository()
    const users = await usersRepository.all()
    return response.json(users)
  }

  static async create (request, response) {
    const createUserAction = new CreateUserAction(userRepository)
    const user = await createUserAction.execute(request.body)

    return response.status(201).json(user)
  }

  static async update (request, response) {
    const updateUserAction = new UpdateUserAction(userRepository)
    const user = await updateUserAction.execute({
      id: request.user.id,
      ...request.body
    })

    return response.json(user)
  }

  static async delete (request, response) {
    await new DeleteUserAction(userRepository).execute({ id: request.params.userId })
    return response.status(200).end()
  }
}
module.exports = UsersController
