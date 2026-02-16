import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ObjectiveDto {
  @IsString()
  @ApiProperty({
    description: 'Objective title.',
    example: 'Grow customer retention in Q2.',
  })
  title!: string;
}
