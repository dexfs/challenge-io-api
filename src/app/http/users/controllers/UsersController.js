import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import CreateUserAction from '@app/actions/CreateUserAction';
import UpdateUserAction from '@app/actions/UpdateUserAction';
import DeleteUserAction from '@app/actions/DeleteUserAction';
import GetUserByUsername from '@app/actions/GetUserByUsername';

import UsersRepository from '@app/repositories/UsersRepository';

class UsersController {
  static async index(request: Request, response: Response): Promise<Response> {
    const usersRepository = getCustomRepository(UsersRepository);
    const users = await usersRepository.find();
    return response.json(users);
  }

  static async show(request: Request, response: Response): Promise<Response> {
    const { username } = request.params;
    const getUserByUsername = new GetUserByUsername();
    const user = await getUserByUsername.execute({ username });
    return response.json(user);
  }

  static async create(request: Request, response: Response): Promise<Response> {
    const createUserAction = new CreateUserAction();
    const user = await createUserAction.execute(request.body);

    return response.status(201).json(user);
  }

  static async update(request: Request, response: Response): Promise<Response> {
    const updateUserAction = new UpdateUserAction();
    const user = await updateUserAction.execute({
      id: request.user.id,
      ...request.body,
    });

    return response.json(user);
  }

  static async delete(request: Request, response: Response): Promise<void> {
    await new DeleteUserAction().execute({ id: request.user.id });
    return response.status(200).end();
  }
}
export default UsersController;
