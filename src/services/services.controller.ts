import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ServicesService } from './services.service';

@ApiTags('services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Список всіх послуг' })
  getAll(@Query('categoryId') categoryId?: string) {
    if (categoryId) {
      return this.servicesService.findByCategory(parseInt(categoryId));
    }
    return this.servicesService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Пошук послуг/майстрів' })
  search(@Query('q') q: string) {
    return this.servicesService.search(q || '');
  }

  @Get('categories')
  getCategories() {
    return this.servicesService.findAllCategories();
  }
}
