import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Objective, Prisma } from '../../generated/prisma/client';
import type { PrismaClient } from '../../generated/prisma/client';
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

  delete(objectiveId: number) {
    return this.prismaService.objective.delete({
      where: { id: objectiveId },
    });
  }
}
