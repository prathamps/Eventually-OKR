import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ObjectivesModule } from './objectives/objectives.module';
import { KeyResultsModule } from './keyresult/keyResultsModule';

@Module({
  imports: [
    ObjectivesModule,
    KeyResultsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
