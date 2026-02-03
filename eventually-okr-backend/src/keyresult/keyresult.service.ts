import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateKeyresultDto } from './dto/create-keyresult.dto';
import type { UpdateKeyresultDto } from './dto/update-keyresult.dto';

@Injectable()
export class KeyresultService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateKeyresultDto) {
    const description = dto.description?.trim();
    if (!description) throw new BadRequestException('Description is required.');
    if (dto.progress === undefined || Number.isNaN(Number(dto.progress))) {
      throw new BadRequestException('Progress is required.');
    }
    const progress = Number(dto.progress);
    if (progress < 0 || progress > 100) {
      throw new BadRequestException('Progress should be in the range 0-100.');
    }

    const objective = await this.prisma.objective.findUnique({
      where: { id: Number(dto.objectiveId) },
      select: { id: true },
    });
    if (!objective) throw new NotFoundException('Objective not found.');

    return this.prisma.keyResult.create({
      data: {
        description,
        progress,
        objectiveId: objective.id,
      },
    });
  }

  async findAll(objectiveId?: number) {
    return this.prisma.keyResult.findMany({
      where: objectiveId ? { objectiveId } : undefined,
      orderBy: { id: 'asc' },
    });
  }

  async update(id: number, dto: UpdateKeyresultDto) {
    const existing = await this.prisma.keyResult.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Key result not found.');

    const nextDescription =
      dto.description === undefined ? undefined : dto.description.trim();
    if (nextDescription !== undefined && !nextDescription) {
      throw new BadRequestException('Description is required.');
    }

    const nextProgress =
      dto.progress === undefined ? undefined : Number(dto.progress);
    if (nextProgress !== undefined) {
      if (Number.isNaN(nextProgress)) {
        throw new BadRequestException('Progress must be a number.');
      }
      if (nextProgress < 0 || nextProgress > 100) {
        throw new BadRequestException('Progress should be in the range 0-100.');
      }
    }

    return this.prisma.keyResult.update({
      where: { id },
      data: {
        description: nextDescription,
        progress: nextProgress,
      },
    });
  }

  async remove(id: number) {
    const existing = await this.prisma.keyResult.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Key result not found.');
    return this.prisma.keyResult.delete({ where: { id } });
  }
}
