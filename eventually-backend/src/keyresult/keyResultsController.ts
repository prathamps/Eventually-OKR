import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { KeyResultsService } from './key-results.service';
import { KeyResultDto } from './dto/keyResultDto';
import { UpdateKeyResultDto } from './dto/updateKeyResultDto';
import { KeyResultProgressPipe } from './pipes/keyResultProgressPipe';

@Controller('/objective/:objectiveId/key-results')
export class KeyResultsController {
  constructor(private readonly keyResultsService: KeyResultsService) {}

  @Get()
  getByObjectiveId(@Param('objectiveId', ParseIntPipe) objectiveId: number) {
    return this.keyResultsService.getByObjectiveId(objectiveId);
  }

  @Post()
  create(
    @Body() createKeyResultDto: KeyResultDto,
    @Param('objectiveId', ParseIntPipe) objectiveId: number,
  ) {
    return this.keyResultsService.create(createKeyResultDto, objectiveId);
  }

  @Patch(':keyResultId')
  update(
    @Body(new KeyResultProgressPipe())
    updateKeyResultDto: Partial<UpdateKeyResultDto>,
    @Param('keyResultId', ParseIntPipe) keyResultId: number,
  ) {
    return this.keyResultsService.update(updateKeyResultDto, keyResultId);
  }

  @Delete(':keyResultId')
  delete(@Param('keyResultId', ParseIntPipe) keyResultId: number) {
    return this.keyResultsService.delete(keyResultId);
  }
}
