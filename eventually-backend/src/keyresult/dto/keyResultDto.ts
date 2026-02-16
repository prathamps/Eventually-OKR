import { ApiProperty } from '@nestjs/swagger';

export class KeyResultDto {
  @ApiProperty({
    description: 'Short description of the key result.',
    example: 'Increase monthly active users by 20%.',
  })
  description!: string;

  @ApiProperty({
    description: 'Progress percentage from 0 to 100.',
    example: 35,
    minimum: 0,
    maximum: 100,
  })
  progress!: number;
}
