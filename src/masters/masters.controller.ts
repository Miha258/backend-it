import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MastersService } from './masters.service';

@ApiTags('masters')
@Controller('masters')
export class MastersController {
  constructor(private readonly mastersService: MastersService) {}

  @Get()
  @ApiOperation({ summary: 'Список майстрів' })
  findAll() {
    return this.mastersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Профіль майстра' })
  findOne(@Param('id') id: string) {
    return this.mastersService.findOne(id);
  }
}
