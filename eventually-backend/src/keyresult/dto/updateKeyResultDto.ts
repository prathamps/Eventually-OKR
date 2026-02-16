import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateKeyResultDto {
  @ApiPropertyOptional({
    description: 'Short description of the key result.',
    example: 'Increase monthly active users by 20%.',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Metric for the key result (user-defined).',
    example: 'users',
  })
  metric?: string;

  @ApiPropertyOptional({
    description: 'Latest updated value for the key result.',
    example: 1500,
    minimum: 0,
  })
  updatedValue?: number;

  @ApiPropertyOptional({
    description: 'Target value for the key result.',
    example: 2000,
    minimum: 0,
  })
  targetValue?: number;

  @ApiPropertyOptional({
    description: 'Whether the key result is completed.',
    example: false,
  })
  isCompleted?: boolean;
}
