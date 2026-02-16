import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateKeyResultDto {
  @ApiPropertyOptional({
    description: 'Short description of the key result.',
    example: 'Increase monthly active users by 20%.',
  })
  description: string;

  @ApiPropertyOptional({
    description: 'Progress percentage from 0 to 100.',
    example: 60,
    minimum: 0,
    maximum: 100,
  })
  progress: number;

  @ApiPropertyOptional({
    description: 'Whether the key result is completed.',
    example: false,
  })
  isCompleted: boolean;
}
