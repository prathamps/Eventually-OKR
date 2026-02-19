import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateObjectiveDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Natural-language prompt describing an objective and optional key results.',
    example:
      'Improve onboarding conversion to 35% with better activation emails and product tour completion.',
  })
  prompt!: string;
}

