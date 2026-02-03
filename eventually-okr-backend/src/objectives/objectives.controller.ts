import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import type { CreateObjectiveDto } from './dto/create-objective.dto';
import type { UpdateObjectiveDto } from './dto/update-objective.dto';
import { ObjectivesService } from './objectives.service';

@Controller('objectives')
export class ObjectivesController {
  constructor(private readonly objectivesService: ObjectivesService) {}

  @Post()
  create(@Body() dto: CreateObjectiveDto) {
    return this.objectivesService.create(dto);
  }

  @Get()
  findAll() {
    return this.objectivesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.objectivesService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateObjectiveDto) {
    return this.objectivesService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.objectivesService.remove(Number(id));
  }
}
