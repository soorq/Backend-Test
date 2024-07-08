import { Body, Controller, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from '@/shared/crud';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateOneCategory,
  ApiDeleteOneCategory,
  ApiGetAllCategories,
  ApiGetOneCategoryOneById,
} from '@/infra/framework/category/category.api';

@Controller('category')
@ApiTags('Categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @ApiCreateOneCategory()
  async create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @ApiGetAllCategories()
  async getAll() {
    return this.service.findAll();
  }

  @ApiGetOneCategoryOneById()
  async getOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiDeleteOneCategory()
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
