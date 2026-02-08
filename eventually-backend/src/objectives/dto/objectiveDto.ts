import { IsString } from 'class-validator';

export class ObjectiveDto {
  @IsString()
  title: string;
}
