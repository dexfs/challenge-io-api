import { getCustomRepository } from 'typeorm';
import { NotFound, GeneralError } from '@app/exceptions/errors';;
import RoomRepository from '../repositories/RoomRepository';
import RoomParticipantRepository from '../repositories/RoomParticipantRepository';

import Room from '../entities/Room';
import AbstractAction from './ActionAbstract';

interface Input {
  userId: string;
  roomId: string;
}

class JoinRoomAction extends AbstractAction {
  public async execute({ userId, roomId }: Input): Promise<Room | undefined> {
    const {roomRepository, roomParticipantRepository} = this.loadRepositories();
    const room = await roomRepository.findOne(roomId);

    if (!room) {
      throw new NotFound('The room does not exits.');
    }

    if (room.hostUser === userId) {
      throw new GeneralError("You're the host.");
    }

    const countMembersRoom = await roomParticipantRepository.count({
      where: { roomId },
    });

    if (countMembersRoom >= room.capacityLimit) {
      throw new GeneralError('Maximum room members reached');
    }

    const participantJoin = await roomParticipantRepository.create({
      userId,
      roomId,
    });
    await roomParticipantRepository.save(participantJoin);
    return roomRepository.findOne({
      relations: ['participants'],
      where: { id: roomId },
    });
  }

  loadRepositories() {
    return {
      roomRepository: getCustomRepository(RoomRepository),
      roomParticipantRepository: getCustomRepository(RoomParticipantRepository)
    }
  }
}

export default JoinRoomAction;
