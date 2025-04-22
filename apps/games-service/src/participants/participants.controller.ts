import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ParticipantsService } from './participants.service';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { RemoveParticipantDto } from './dto/remove-participant.dto';

@Controller()
export class ParticipantsController {
  constructor(private readonly participantsService: ParticipantsService) {}

  @MessagePattern('createParticipant')
  create(@Payload() createParticipantDto: CreateParticipantDto) {
    return this.participantsService.create(createParticipantDto);
  }

  @MessagePattern('findAllParticipants')
  findAll() {
    return this.participantsService.findAll();
  }

  @MessagePattern('findAllPariticipantForTeamId')
  findAllPariticipantForTeamId(teamId: number) {
    return this.participantsService.findAllPariticipantForTeamId(teamId);
  }

  @MessagePattern('findOneParticipant')
  findOne(@Payload() id: number) {
    return this.participantsService.findOne(id);
  }

  @MessagePattern('updateParticipant')
  update(@Payload() updateParticipantDto: UpdateParticipantDto) {
    return this.participantsService.update(
      updateParticipantDto.id,
      updateParticipantDto,
    );
  }

  @MessagePattern('removeParticipant')
  remove(@Payload() removeParticipantDto: RemoveParticipantDto) {
    return this.participantsService.remove(removeParticipantDto);
  }
}
