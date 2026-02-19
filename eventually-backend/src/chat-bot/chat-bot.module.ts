import { Module } from '@nestjs/common';
import { GeminiService } from '../ai/gemini.service';
import { PrismaService } from '../../prisma.service';
import { ChatBotController } from './chat-bot.controller';
import { ChatBotService } from './chat-bot.service';

@Module({
  controllers: [ChatBotController],
  providers: [ChatBotService, GeminiService, PrismaService],
})
export class ChatBotModule {}

