import { getCustomRepository } from 'typeorm';
import { compare, hash } from 'bcryptjs';

import UserRepository from '@app/repositories/UsersRepository';
import { BadRequest, NotFound } from '@app/exceptions/errors';
import User from '@app/entities/User';
import AbstractAction from './ActionAbstract';

interface Input {
  id: string;
  currentPassword?: string;
  newPassword?: string;
  mobileToken?: string;
}

interface IVerifyPassword {
  user: User;
  currentPassword: string;
  newPassword: string;
}

class UpdateUserAction extends AbstractAction{
  public async execute({
    id,
    currentPassword,
    newPassword,
    mobileToken,
  }: Input): Promise<User | undefined> {
    const {userRepository} = this.loadRepositories();
    const userFound = await userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'password'],
    });

    if (!userFound) {
      throw new NotFound(`Oh no!, user not found`);
    }

    if (currentPassword && !newPassword) {
      throw new BadRequest("It's necessary to pass a new password.");
    }

    if (currentPassword && newPassword) {
      const passwordHash = await this.verifyCurrentPasswordAndGenerateHash({
        user: userFound,
        currentPassword,
        newPassword,
      });
      userFound.password = passwordHash;
    }

    userFound.mobileToken = mobileToken as string;

    const user = await userRepository.save(userFound);

    delete user.password;

    return user;
  }

  private async verifyCurrentPasswordAndGenerateHash({
    user,
    currentPassword,
    newPassword,
  }: IVerifyPassword) {
    const isCorrectPassword = await compare(currentPassword, user.password);
    if (!isCorrectPassword) {
      throw new BadRequest('Current password is not valid.');
    }
    return hash(newPassword, 10);
  }

  loadRepositories() {
    return {
      userRepository: getCustomRepository(UserRepository)
    }
  }
}

export default UpdateUserAction;
