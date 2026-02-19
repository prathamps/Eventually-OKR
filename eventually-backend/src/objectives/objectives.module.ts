import { Module } from '@nestjs/common';
import { ObjectivesController } from './objectives.controller';
import { ObjectivesService } from './objectives.service';
import { PrismaService } from '../../prisma.service';
import { GeminiService } from '../ai/gemini.service';
import { OkrGeneratorService } from '../ai/okr-generator.service';

@Module({
  controllers: [ObjectivesController],
  providers: [
    ObjectivesService,
    PrismaService,
    GeminiService,
    OkrGeneratorService,
  ],
})
export class ObjectivesModule {}
