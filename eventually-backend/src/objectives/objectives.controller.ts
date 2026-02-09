import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ObjectivesService } from './objectives.service';
import { ObjectiveDto } from './dto/objectiveDto';
import { CreateObjectiveWithKeyResultsDto } from './dto/createObjectiveWithKeyResultsDto';
import { ObjectivesFilter } from './objectivesFilter';

@UseFilters(ObjectivesFilter)
@Controller('objectives')
export class ObjectivesController {
  constructor(private readonly objectivesService: ObjectivesService) {}

  @Get()
  getAll() {
    return this.objectivesService.getAll();
  }

  @Get(':objectiveId')
  getById(@Param('objectiveId', ParseIntPipe) objectiveId: number) {
    return this.objectivesService.getById(objectiveId);
  }

  @Post()
  create(@Body() createObjectiveDto: CreateObjectiveWithKeyResultsDto) {
    return this.objectivesService.create(createObjectiveDto);
  }

  @Patch(':objectiveId')
  update(
    @Param('objectiveId', ParseIntPipe) objectiveId: number,
    @Body() updateObjectiveDto: ObjectiveDto,
  ) {
    return this.objectivesService.update(objectiveId, updateObjectiveDto);
  }

  @Delete(':objectiveId')
  delete(@Param('objectiveId', ParseIntPipe) objectiveId: number) {
    return this.objectivesService.delete(objectiveId);
  }
}
