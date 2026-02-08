import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ObjectivesService } from './objectives.service';
import { ObjectiveDto } from './dto/objectiveDto';

@Controller('objectives')
export class ObjectivesController {
  constructor(private readonly objectivesService: ObjectivesService) {}

  @Get()
  getAll() {
    return this.objectivesService.getAll();
  }

  @Get(':objectiveId')
  getById(@Param('objectiveId') objectiveId: number) {
    return this.objectivesService.getById(objectiveId);
  }

  @Post()
  create(@Body() createObjectiveDto: ObjectiveDto) {
    return this.objectivesService.create(createObjectiveDto);
  }

  @Patch(':objectiveId')
  update(
    @Param('objectiveId') objectiveId: number,
    @Body() updateObjectiveDto: ObjectiveDto,
  ) {
    return this.objectivesService.update(objectiveId, updateObjectiveDto);
  }

  @Delete(':objectiveId')
  delete(@Param('objectiveId') objectiveId: number) {
    return this.objectivesService.delete(objectiveId);
  }
}
