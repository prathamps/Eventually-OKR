import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { KeyResultDto } from '../../keyresult/dto/keyResultDto';

export class CreateObjectiveWithKeyResultsDto {
  @IsString()
  @ApiProperty({
    description: 'Objective title.',
    example: 'Improve onboarding activation.',
  })
  title!: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeyResultDto)
  @ApiPropertyOptional({
    description: 'Optional list of key results to create with the objective.',
    type: () => [KeyResultDto],
  })
  keyResults?: KeyResultDto[];
}
