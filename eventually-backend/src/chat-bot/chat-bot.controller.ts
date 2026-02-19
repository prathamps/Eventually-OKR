import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChatBotService } from './chat-bot.service';
import { CreateChatDto } from './dto/create-chat.dto';

@Controller('chat-bot')
@ApiTags('Chat Bot')
export class ChatBotController {
  constructor(private readonly chatBotService: ChatBotService) {}

  @Post()
  @ApiOperation({
    summary: 'Generate an OKR-focused chatbot response using relevant objectives.',
  })
  @ApiBody({
    type: CreateChatDto,
  })
  @ApiOkResponse({
    description: 'Chatbot response as plain text.',
    type: String,
  })
  generate(@Body() createChatBotDto: CreateChatDto) {
    return this.chatBotService.generate(createChatBotDto);
  }
}

