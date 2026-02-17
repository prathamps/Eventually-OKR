import { ApiProperty } from '@nestjs/swagger';

export class KeyResultResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({
    description: 'Short description of the key result.',
    example: 'Increase monthly active users by 20%.',
  })
  description!: string;

  @ApiProperty({
    description: 'Metric for the key result (user-defined).',
    example: 'users',
  })
  metric!: string;

  @ApiProperty({
    description: 'Latest updated value for the key result.',
    example: 1200,
    minimum: 0,
  })
  updatedValue!: number;

  @ApiProperty({
    description: 'Target value for the key result.',
    example: 2000,
    minimum: 0,
  })
  targetValue!: number;

  @ApiProperty({
    description: 'Whether the key result is completed.',
    example: false,
  })
  isCompleted!: boolean;

  @ApiProperty({ example: 3, description: 'Parent objective id.' })
  objectiveId!: number;

  @ApiProperty({
    description: 'Creation timestamp (ISO 8601).',
    example: '2026-02-12T10:15:30.000Z',
  })
  createdAt!: Date;
}
