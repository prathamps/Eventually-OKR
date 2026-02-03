import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import type { CreateKeyresultDto } from './dto/create-keyresult.dto';
import type { UpdateKeyresultDto } from './dto/update-keyresult.dto';
import { KeyresultService } from './keyresult.service';

@Controller('keyresult')
export class KeyresultController {
  constructor(private readonly keyresultService: KeyresultService) {}

  @Post()
  create(@Body() dto: CreateKeyresultDto) {
    return this.keyresultService.create(dto);
  }

  @Get()
  findAll(@Query('objectiveId') objectiveId?: string) {
    return this.keyresultService.findAll(
      objectiveId ? Number(objectiveId) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.keyresultService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateKeyresultDto) {
    return this.keyresultService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.keyresultService.remove(Number(id));
  }
}
