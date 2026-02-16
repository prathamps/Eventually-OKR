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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectivesService } from './objectives.service';
import { ObjectiveDto } from './dto/objectiveDto';
import { CreateObjectiveWithKeyResultsDto } from './dto/createObjectiveWithKeyResultsDto';
import { ObjectivesFilter } from './objectivesFilter';
import { ObjectiveResponseDto } from './dto/objectiveResponseDto';
import { ObjectiveWithKeyResultsResponseDto } from './dto/objectiveWithKeyResultsResponseDto';
import { ObjectiveCompletednessDto } from './dto/objectiveCompletednessDto';

@UseFilters(ObjectivesFilter)
@Controller('objectives')
@ApiTags('Objectives')
export class ObjectivesController {
  constructor(private readonly objectivesService: ObjectivesService) {}

  @Get()
  @ApiOperation({ summary: 'List all objectives with key results.' })
  @ApiOkResponse({
    description: 'List of objectives.',
    type: [ObjectiveWithKeyResultsResponseDto],
  })
  getAll() {
    return this.objectivesService.getAll();
  }

  @Get(':objectiveId')
  @ApiOperation({ summary: 'Get objective by id.' })
  @ApiParam({
    name: 'objectiveId',
    type: Number,
    description: 'Objective id.',
  })
  @ApiOkResponse({ description: 'Objective found.', type: ObjectiveResponseDto })
  @ApiNotFoundResponse({ description: 'Objective not found.' })
  getById(@Param('objectiveId', ParseIntPipe) objectiveId: number) {
    return this.objectivesService.getById(objectiveId);
  }

  @Get(':objectiveId/completedness')
  @ApiOperation({ summary: 'Get objective completedness.' })
  @ApiParam({
    name: 'objectiveId',
    type: Number,
    description: 'Objective id.',
  })
  @ApiOkResponse({
    description: 'Objective completedness.',
    type: ObjectiveCompletednessDto,
  })
  @ApiNotFoundResponse({ description: 'Objective not found.' })
  getCompletedness(@Param('objectiveId', ParseIntPipe) objectiveId: number) {
    return this.objectivesService.getCompletedness(objectiveId);
  }

  @Post()
  @ApiOperation({ summary: 'Create an objective (optionally with key results).' })
  @ApiCreatedResponse({
    description: 'Objective created.',
    type: ObjectiveWithKeyResultsResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation error.' })
  create(@Body() createObjectiveDto: CreateObjectiveWithKeyResultsDto) {
    return this.objectivesService.create(createObjectiveDto);
  }

  @Patch(':objectiveId')
  @ApiOperation({ summary: 'Update an objective.' })
  @ApiParam({
    name: 'objectiveId',
    type: Number,
    description: 'Objective id.',
  })
  @ApiOkResponse({ description: 'Objective updated.', type: ObjectiveResponseDto })
  @ApiBadRequestResponse({ description: 'Validation error.' })
  @ApiNotFoundResponse({ description: 'Objective not found.' })
  update(
    @Param('objectiveId', ParseIntPipe) objectiveId: number,
    @Body() updateObjectiveDto: ObjectiveDto,
  ) {
    return this.objectivesService.update(objectiveId, updateObjectiveDto);
  }

  @Delete(':objectiveId')
  @ApiOperation({ summary: 'Delete an objective.' })
  @ApiParam({
    name: 'objectiveId',
    type: Number,
    description: 'Objective id.',
  })
  @ApiOkResponse({ description: 'Objective deleted.', type: ObjectiveResponseDto })
  @ApiNotFoundResponse({ description: 'Objective not found.' })
  delete(@Param('objectiveId', ParseIntPipe) objectiveId: number) {
    return this.objectivesService.delete(objectiveId);
  }
}
