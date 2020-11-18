import { getCustomRepository } from 'typeorm';
import { NotFound, BadRequest } from '@app/exceptions/errors';
import RoomRepository from '../repositories/RoomRepository';
import Room from '../entities/Room';
import AbstractAction from './ActionAbstract';
interface Input {
  roomId: string;
  currentHost: string;
  newHost: string;
}

type InputRoomAndHost = Omit<Input, 'newHost'>

class ChangeRoomHostAction extends AbstractAction {
  public async execute({
    roomId,
    currentHost,
    newHost,
  }: Input): Promise<Room | undefined> {
    if (currentHost === newHost) {
      throw new BadRequest("You're already host of this room.");
    }

    const { roomRepository } = this.loadRepositories()

    const roomFound = await this.getRoomByHost({
      roomId,
      currentHost,
    });

    if (!roomFound) {
      throw new NotFound('Room not found.');
    }
    await roomRepository.update(roomFound.id, { hostUser: newHost });
    const room = await roomRepository.findOne(roomFound.id);

    return room;
  }
  private async getRoomByHost({ roomId, currentHost }: InputRoomAndHost) {
    const { roomRepository } = this.loadRepositories()

    return await roomRepository.findByIdAndHost({
      roomId,
      hostId: currentHost,
    });
  }

  loadRepositories(): any {
    return {
      roomRepository: getCustomRepository(RoomRepository),
    }
  }


}

export default ChangeRoomHostAction;
