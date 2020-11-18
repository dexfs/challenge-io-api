import { getCustomRepository } from 'typeorm';
import RoomRepository from '../repositories/RoomRepository';
import Room from '../entities/Room';
import AbstractAction from './ActionAbstract';

interface Input {
  name: string;
  hostUser: string;
  capacityLimit?: number;
}

class CreateRoomAction extends AbstractAction {
  public async execute(input: Input): Promise<Room> {
    const {roomRepository} = this.loadRepositories()
    const room = await roomRepository.create(input);
    await roomRepository.save(room);
    return room;
  }

  loadRepositories() {
    return{
      roomRepository: getCustomRepository(RoomRepository)
    };

  }
}

export default CreateRoomAction;
