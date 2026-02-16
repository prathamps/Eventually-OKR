import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class KeyResultDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Short description of the key result.',
    example: 'Increase monthly active users by 20%.',
  })
  description!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Metric for the key result (user-defined).',
    example: 'users',
  })
  metric!: string;

  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Latest updated value for the key result.',
    example: 1200,
    minimum: 0,
  })
  updatedValue!: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty({
    description: 'Target value for the key result.',
    example: 2000,
    minimum: 0.000001,
  })
  targetValue!: number;
}
