import { getCustomRepository } from 'typeorm';

import UsersRepository from '@app/repositories/UsersRepository';
import { NotFound } from '@app/exceptions/errors';
import User from '@app/entities/User';
import AbstractAction from './ActionAbstract';

interface Input {
  username: string;
}

class GetUserByUsername extends AbstractAction {
  async execute({ username }: Input): Promise<User | undefined> {
    const { usersRepository } = this.loadRepositories();
    const user = await usersRepository.findByUsername(username);
    if (!user) {
      throw new NotFound('User not found.');
    }

    return user;
  }
  loadRepositories() {
    return {
      usersRepository: getCustomRepository(UsersRepository)
    }
  }
}

export default GetUserByUsername;
