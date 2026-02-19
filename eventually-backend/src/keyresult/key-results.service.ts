import { BadRequestException, Injectable } from '@nestjs/common';
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

  private ensureValidProgressValues(updatedValue: number, targetValue: number) {
    if (updatedValue > targetValue) {
      throw new BadRequestException(
        'Updated value cannot be greater than target value.',
      );
    }
  }

  create(createKeyResultDto: KeyResultDto, objectiveId: number) {
    this.ensureValidProgressValues(
      createKeyResultDto.updatedValue,
      createKeyResultDto.targetValue,
    );

    return this.prismaService.keyResult.create({
      data: {
        ...createKeyResultDto,
        objectiveId,
      },
    });
  }

  async update(
    updateKeyResultDto: Partial<UpdateKeyResultDto>,
    keyResultId: number,
  ) {
    if (
      updateKeyResultDto.updatedValue !== undefined ||
      updateKeyResultDto.targetValue !== undefined
    ) {
      const existingKeyResult = await this.prismaService.keyResult.findUnique({
        where: { id: keyResultId },
        select: { updatedValue: true, targetValue: true },
      });

      if (existingKeyResult) {
        const nextUpdatedValue =
          updateKeyResultDto.updatedValue ?? existingKeyResult.updatedValue;
        const nextTargetValue =
          updateKeyResultDto.targetValue ?? existingKeyResult.targetValue;

        this.ensureValidProgressValues(nextUpdatedValue, nextTargetValue);
      }
    }

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
