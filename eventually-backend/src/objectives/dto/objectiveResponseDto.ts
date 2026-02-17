import { ApiProperty } from '@nestjs/swagger';

export class ObjectiveResponseDto {
  @ApiProperty({ example: 3 })
  id!: number;

  @ApiProperty({
    description: 'Objective title.',
    example: 'Improve onboarding activation.',
  })
  title!: string;

  @ApiProperty({
    description: 'Creation timestamp (ISO 8601).',
    example: '2026-02-12T10:15:30.000Z',
  })
  createdAt!: Date;
}
