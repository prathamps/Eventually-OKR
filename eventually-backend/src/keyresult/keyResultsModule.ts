import { Module } from '@nestjs/common';
import { KeyResultsController } from './keyResultsController';
import { KeyResultsService } from './key-results.service';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [KeyResultsController],
  providers: [KeyResultsService, PrismaService],
})
export class KeyResultsModule {}
