import { getCustomRepository } from 'typeorm';

import UserRepository from '@app/repositories/UsersRepository';
import AbstractAction from './ActionAbstract';

interface Input {
  id: string;
}

class DeleteUserAction extends AbstractAction {
  public async execute({ id }: Input): Promise<void> {
    const { userRepository } = this.loadRepositories();
    await userRepository.delete(id);
  }

  loadRepositories() {
    return {
      userRepository: getCustomRepository(UserRepository)
    }

  }
}

export default DeleteUserAction;
