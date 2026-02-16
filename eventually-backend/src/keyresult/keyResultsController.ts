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
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { KeyResultsService } from './key-results.service';
import { KeyResultDto } from './dto/keyResultDto';
import { UpdateKeyResultDto } from './dto/updateKeyResultDto';
import { KeyResultProgressPipe } from './pipes/keyResultProgressPipe';
import { KeyResultResponseDto } from './dto/keyResultResponseDto';

@Controller('/objective/:objectiveId/key-results')
@ApiTags('Key Results')
export class KeyResultsController {
  constructor(private readonly keyResultsService: KeyResultsService) {}

  @Get()
  @ApiOperation({ summary: 'List key results for an objective.' })
  @ApiParam({
    name: 'objectiveId',
    type: Number,
    description: 'Objective id.',
  })
  @ApiOkResponse({
    description: 'List of key results.',
    type: [KeyResultResponseDto],
  })
  @ApiNotFoundResponse({ description: 'Objective not found.' })
  getByObjectiveId(@Param('objectiveId', ParseIntPipe) objectiveId: number) {
    return this.keyResultsService.getByObjectiveId(objectiveId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a key result for an objective.' })
  @ApiParam({
    name: 'objectiveId',
    type: Number,
    description: 'Objective id.',
  })
  @ApiCreatedResponse({
    description: 'Key result created.',
    type: KeyResultResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation error.' })
  @ApiNotFoundResponse({ description: 'Objective not found.' })
  create(
    @Body() createKeyResultDto: KeyResultDto,
    @Param('objectiveId', ParseIntPipe) objectiveId: number,
  ) {
    return this.keyResultsService.create(createKeyResultDto, objectiveId);
  }

  @Patch(':keyResultId')
  @ApiOperation({ summary: 'Update a key result.' })
  @ApiParam({
    name: 'objectiveId',
    type: Number,
    description: 'Objective id.',
  })
  @ApiParam({
    name: 'keyResultId',
    type: Number,
    description: 'Key result id.',
  })
  @ApiOkResponse({
    description: 'Key result updated.',
    type: KeyResultResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation error. Progress must be between 0 and 100.',
  })
  @ApiNotFoundResponse({ description: 'Key result not found.' })
  update(
    @Body(new KeyResultProgressPipe())
    updateKeyResultDto: Partial<UpdateKeyResultDto>,
    @Param('keyResultId', ParseIntPipe) keyResultId: number,
  ) {
    return this.keyResultsService.update(updateKeyResultDto, keyResultId);
  }

  @Delete(':keyResultId')
  @ApiOperation({ summary: 'Delete a key result.' })
  @ApiParam({
    name: 'objectiveId',
    type: Number,
    description: 'Objective id.',
  })
  @ApiParam({
    name: 'keyResultId',
    type: Number,
    description: 'Key result id.',
  })
  @ApiOkResponse({
    description: 'Key result deleted.',
    type: KeyResultResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Key result not found.' })
  delete(@Param('keyResultId', ParseIntPipe) keyResultId: number) {
    return this.keyResultsService.delete(keyResultId);
  }
}
