import { getCustomRepository } from 'typeorm';
import UsersRepository from '@app/repositories/UsersRepository';
import Room from '@app/entities/Room';
import { NotFound } from '@app/exceptions/errors';
import AbstractAction from './ActionAbstract';

interface Input {
  username: string;
}

class GetRoomsByUsername extends AbstractAction {
  public async execute({ username }: Input): Promise<Room[][]> {
    const { usersRepository } = this.loadRepositories();
    const user = await usersRepository.findByUsername(username, {
      relations: ['rooms', 'rooms.room'],
    });

    if (!user) {
      throw new NotFound('User not found!');
    }

    const rooms = user.rooms.reduce<Room[][]>((acc: any, current: any) => {
      acc = [...acc, current.room];
      return acc;
    }, []);

    return rooms;
  }
  loadRepositories() {
    return {
      usersRepository: getCustomRepository(UsersRepository)
    }
  }
}

export default GetRoomsByUsername;
