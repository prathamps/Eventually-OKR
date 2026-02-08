import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { KeyResultsService } from './key-results.service';
import { CreateKeyResultDto } from './dto/createKeyResultDto';
import { UpdateKeyResultDto } from './dto/updateKeyResultDto';

@Controller('/objective/:objectiveId/key-results')
export class KeyResultsController {
  constructor(private readonly keyResultsService: KeyResultsService) {}

  @Get()
  getByObjectiveId(@Param('objectiveId') objectiveId: number) {
    return this.keyResultsService.getByObjectiveId(objectiveId);
  }

  @Post()
  create(
    @Body() createKeyResultDto: CreateKeyResultDto,
    @Param('objectiveId') objectiveId: number,
  ) {
    return this.keyResultsService.create(createKeyResultDto, objectiveId);
  }

  @Patch(':keyResultId')
  update(
    @Body() updateKeyResultDto: Partial<UpdateKeyResultDto>,
    @Param('keyResultId') keyResultId: number,
  ) {
    return this.keyResultsService.update(updateKeyResultDto, keyResultId);
  }

  @Delete(':keyResultId')
  delete(@Param('keyResultId') keyResultId: number) {
    return this.keyResultsService.delete(keyResultId);
  }
}
