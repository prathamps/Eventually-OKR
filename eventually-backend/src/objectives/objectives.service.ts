import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Objective } from '../../generated/prisma/client';
import { ObjectiveDto } from './dto/objectiveDto';

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
    return this.prismaService.objective.findUnique({
      where: {
        id: objectiveId,
      },
    });
  }

  create(createObjectiveDto: ObjectiveDto) {
    return this.prismaService.objective.create({
      data: createObjectiveDto,
    });
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
