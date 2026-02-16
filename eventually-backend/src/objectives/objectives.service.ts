import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { KeyResult, Objective, Prisma } from '@prisma/client';
import type { PrismaClient } from '@prisma/client';
import { ObjectiveDto } from './dto/objectiveDto';
import { CreateObjectiveWithKeyResultsDto } from './dto/createObjectiveWithKeyResultsDto';

@Injectable()
export class ObjectivesService {
  constructor(private readonly prismaService: PrismaService) {}

  getAll(): Promise<Objective[]> {
    return this.prismaService.objective.findMany({
      include: {
        keyResults: true,
      },
    });
  }

  getById(objectiveId: number): Promise<Objective> {
    return this.prismaService.objective.findUniqueOrThrow({
      where: {
        id: objectiveId,
      },
    });
  }

  create(createObjectiveDto: CreateObjectiveWithKeyResultsDto) {
    return this.prismaService.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const prisma = tx as PrismaClient;
        const { keyResults, ...objectiveData } = createObjectiveDto;
        const objective = await prisma.objective.create({
          data: objectiveData,
        });

        if (keyResults?.length) {
          await prisma.keyResult.createMany({
            data: keyResults.map((keyResult) => ({
              ...keyResult,
              objectiveId: objective.id,
            })),
          });
        }

        return prisma.objective.findUnique({
          where: { id: objective.id },
          include: { keyResults: true },
        });
      },
    );
  }

  update(objectiveId: number, updateObjectiveDto: ObjectiveDto) {
    return this.prismaService.objective.update({
      where: { id: objectiveId },
      data: updateObjectiveDto,
    });
  }

  async getCompletedness(objectiveId: number) {
    const objective = await this.prismaService.objective.findUniqueOrThrow({
      where: { id: objectiveId },
      include: { keyResults: true },
    });

    return this.checkCompletedness(objective.keyResults);
  }

  delete(objectiveId: number) {
    return this.prismaService.objective.delete({
      where: { id: objectiveId },
    });
  }

  checkCompletedness(keyResults: KeyResult[]) {
    if (!keyResults.length) {
      return { isComplete: true, progress: 0 };
    }

    const progressValues = keyResults.map((keyResult) =>
      this.calculateProgress(keyResult.updatedValue, keyResult.targetValue),
    );
    const totalProgress = progressValues.reduce((sum, value) => sum + value, 0);
    const progress = Math.round(totalProgress / keyResults.length);
    const isComplete = keyResults.every(
      (keyResult) =>
        keyResult.isCompleted ||
        this.calculateProgress(keyResult.updatedValue, keyResult.targetValue) >=
          100,
    );

    return { isComplete, progress };
  }

  private calculateProgress(updatedValue: number, targetValue: number) {
    if (!Number.isFinite(updatedValue) || !Number.isFinite(targetValue)) {
      return 0;
    }
    if (targetValue <= 0) return 0;
    return (updatedValue / targetValue) * 100;
  }
}
