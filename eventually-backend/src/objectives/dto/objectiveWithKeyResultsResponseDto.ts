import { ApiProperty } from '@nestjs/swagger';
import { KeyResultResponseDto } from '../../keyresult/dto/keyResultResponseDto';

export class ObjectiveWithKeyResultsResponseDto {
  @ApiProperty({ example: 3 })
  id!: number;

  @ApiProperty({
    description: 'Objective title.',
    example: 'Improve onboarding activation.',
  })
  title!: string;

  @ApiProperty({
    description: 'Associated key results.',
    type: () => [KeyResultResponseDto],
  })
  keyResults!: KeyResultResponseDto[];

  @ApiProperty({
    description: 'Creation timestamp (ISO 8601).',
    example: '2026-02-12T10:15:30.000Z',
  })
  createdAt!: Date;
}
