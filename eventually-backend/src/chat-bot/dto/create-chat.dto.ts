import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class ChatMessageDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['user', 'ai'])
  @ApiProperty({
    description: 'Chat speaker role.',
    enum: ['user', 'ai'],
    example: 'user',
  })
  role!: 'user' | 'ai';

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Chat message text.',
    example: 'How is my onboarding objective progressing?',
  })
  content!: string;
}

export class CreateChatDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChatMessageDto)
  @ApiProperty({
    description: 'Conversation history including the latest user message.',
    type: () => [ChatMessageDto],
  })
  chats!: ChatMessageDto[];
}

