import { Module } from '@nestjs/common';
import { KeyresultController } from './keyresult.controller';
import { KeyresultService } from './keyresult.service';

@Module({
  controllers: [KeyresultController],
  providers: [KeyresultService],
})
export class KeyresultModule {}
