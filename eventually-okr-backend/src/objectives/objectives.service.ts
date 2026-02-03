import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateObjectiveDto } from './dto/create-objective.dto';
import type { UpdateObjectiveDto } from './dto/update-objective.dto';

@Injectable()
export class ObjectivesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateObjectiveDto) {
    return this.prisma.objective.create({
      data: {
        objective: dto.objective,
        keyResults: dto.keyResults?.length
          ? { create: dto.keyResults }
          : undefined,
      },
      include: { keyResults: true },
    });
  }

  async findAll() {
    return this.prisma.objective.findMany({
      orderBy: { id: 'asc' },
      include: { keyResults: true },
    });
  }

  async findOne(id: number) {
    const found = await this.prisma.objective.findUnique({
      where: { id },
      include: { keyResults: true },
    });
    if (!found) throw new NotFoundException('Objective not found.');
    return found;
  }

  async update(id: number, dto: UpdateObjectiveDto) {
    await this.findOne(id);
    return this.prisma.objective.update({
      where: { id },
      data: dto,
      include: { keyResults: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.objective.delete({ where: { id } });
  }
}
