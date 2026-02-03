import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ObjectivesModule } from './objectives/objectives.module';
import { KeyresultModule } from './keyresult/keyresult.module';

@Module({
  imports: [PrismaModule, ObjectivesModule, KeyresultModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
