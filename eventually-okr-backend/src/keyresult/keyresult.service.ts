import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateKeyresultDto } from './dto/create-keyresult.dto';
import type { UpdateKeyresultDto } from './dto/update-keyresult.dto';

@Injectable()
export class KeyresultService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateKeyresultDto) {
    return this.prisma.keyResult.create({
      data: {
        description: dto.description,
        progress: dto.progress,
        objectiveId: dto.objectiveId,
      },
    });
  }

  async findAll(objectiveId?: number) {
    return this.prisma.keyResult.findMany({
      where: objectiveId ? { objectiveId } : undefined,
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const found = await this.prisma.keyResult.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Key result not found.');
    return found;
  }

  async update(id: number, dto: UpdateKeyresultDto) {
    await this.findOne(id);
    return this.prisma.keyResult.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.keyResult.delete({ where: { id } });
  }
}
