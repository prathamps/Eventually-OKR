import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { KeyResultDto } from '../../keyresult/dto/keyResultDto';

export class CreateObjectiveWithKeyResultsDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => KeyResultDto)
  keyResults?: KeyResultDto[];
}
