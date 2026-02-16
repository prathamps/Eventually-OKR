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
    description: 'Progress percentage from 0 to 100.',
    example: 45,
    minimum: 0,
    maximum: 100,
  })
  progress!: number;

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
