import { getCustomRepository } from 'typeorm';
import RoomParticipantRepository from '../repositories/RoomParticipantRepository';
import AbstractAction from './ActionAbstract';

interface Input {
  userId: string;
  roomId: string;
}

class LeaveRoomAction extends AbstractAction {
  public async execute({ userId, roomId }: Input): Promise<void> {
    const {roomParticipantRepository} = this.loadRepositories();

    await roomParticipantRepository.delete({
      userId,
      roomId,
    });
  }
  loadRepositories(){
    return {
      roomParticipantRepository: getCustomRepository(RoomParticipantRepository)
    }
  }
}

export default LeaveRoomAction;
