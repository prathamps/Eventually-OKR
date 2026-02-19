import { Module } from '@nestjs/common';
import { ObjectivesController } from './objectives.controller';
import { ObjectivesService } from './objectives.service';
import { PrismaService } from '../../prisma.service';
import { GeminiService } from '../ai/gemini.service';

@Module({
  controllers: [ObjectivesController],
  providers: [ObjectivesService, PrismaService, GeminiService],
})
export class ObjectivesModule {}
