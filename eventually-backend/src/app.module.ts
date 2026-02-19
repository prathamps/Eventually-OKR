import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ObjectivesModule } from './objectives/objectives.module';
import { KeyResultsModule } from './keyresult/keyResultsModule';
import { ChatBotModule } from './chat-bot/chat-bot.module';

@Module({
  imports: [
    ObjectivesModule,
    KeyResultsModule,
    ChatBotModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
