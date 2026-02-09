import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { UpdateKeyResultDto } from './dto/updateKeyResultDto';
import { KeyResultDto } from './dto/keyResultDto';

@Injectable()
export class KeyResultsService {
  constructor(private readonly prismaService: PrismaService) {}

  getByObjectiveId(objectiveId: number) {
    return this.prismaService.keyResult.findMany({
      where: {
        objectiveId,
      },
    });
  }

  create(createKeyResultDto: KeyResultDto, objectiveId: number) {
    return this.prismaService.keyResult.create({
      data: {
        ...createKeyResultDto,
        objectiveId,
      },
    });
  }

  update(updateKeyResultDto: Partial<UpdateKeyResultDto>, keyResultId: number) {
    return this.prismaService.keyResult.update({
      where: {
        id: keyResultId,
      },
      data: {
        ...updateKeyResultDto,
      },
    });
  }

  delete(keyResultId: number) {
    return this.prismaService.keyResult.delete({
      where: { id: keyResultId },
    });
  }
}
