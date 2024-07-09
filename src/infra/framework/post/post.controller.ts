import { CreatePostDto } from '@/shared/crud/post/create-post.dto';
import { UpdatePostDto } from '@/shared/crud/post/update-post.dto';
import { PostService } from './post.service';
import { ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Param,
  ParseIntPipe,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiCreateOneArticle,
  ApiDeleteOneArticle,
  ApiGetAllArticles,
  ApiGetManyArticlesByPagination,
  ApiGetManyArticlesByParams,
  ApiGetOneArticleOneById,
  ApiPatchOneArticle,
} from '@/infra/framework/post/post.api';

@Controller('post')
@ApiTags('Posts')
export class PostController {
  constructor(private readonly service: PostService) {}

  @ApiCreateOneArticle()
  create(@Req() req: Request, @Body() dto: CreatePostDto) {
    return this.service.create(dto, req['user']?.sub);
  }

  @ApiGetAllArticles()
  async getAll() {
    return this.service.findAll();
  }

  @ApiGetOneArticleOneById()
  async getOne(@Param('id') id: string) {
    console.log(id);
    return this.service.findOne(id);
  }

  @ApiGetManyArticlesByPagination()
  async getFiltered(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: string,
  ) {
    return this.service.pagination({
      limit,
      page,
    });
  }

  @ApiGetManyArticlesByParams()
  async findByFilters(
    @Query('author') authorId?: string,
    @Query('start') startDate?: string,
    @Query('end') endDate?: string,
    @Query('categories') categoryIds?: string,
  ) {
    const filters = {
      authorId,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      categoryIds: categoryIds ? categoryIds.split(',') : undefined,
    };

    return this.service.filters(filters);
  }

  @ApiPatchOneArticle()
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return await this.service.update(id, dto);
  }

  @ApiDeleteOneArticle()
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
