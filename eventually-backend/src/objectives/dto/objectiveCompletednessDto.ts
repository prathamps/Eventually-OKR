import { ApiProperty } from '@nestjs/swagger';

export class ObjectiveCompletednessDto {
  @ApiProperty({
    description: 'Whether all key results are completed.',
    example: false,
  })
  isComplete!: boolean;

  @ApiProperty({
    description:
      'Average progress of key results derived from updated/target values.',
    example: 68,
    minimum: 0,
    maximum: 100,
  })
  progress!: number;
}
