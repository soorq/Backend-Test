import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { AccessGuard, RoleGuard } from '@/shared/guards';
import { Roles } from '@/core/domain/decorator';
import { EPost } from '@/core/domain/entities';
import { Role } from '@/shared/roles';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import {
  applyDecorators,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SwagPostModel } from '@/core/base/swagger-models/post.model';
import { BadRequestType } from '@/core/base/swagger-models/bad-request.model';

export const ApiCreateOneArticle = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Создание статьи',
      description:
        'происходит создание в сущность бд - статьи, и привязка к authorId',
    }),
    ApiOkResponse({
      status: HttpStatus.CREATED,
      type: SwagPostModel,
      description: 'Отдает сущность созданную из бд',
    }),
    UseGuards(AccessGuard, RoleGuard),
    Roles(Role.ADMIN, Role.USER),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      type: BadRequestType,
      description:
        'Не корректный запрос или не прошло создание сущности на уровне кода(бд или фичи).',
    }),
    Post('/'),
  );

export const ApiGetAllArticles = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получение всех статьей, всех юзеров',
      description: 'Идет обращение в бд для сбора всех постов',
    }),
    ApiOkResponse({
      status: HttpStatus.OK,
      type: SwagPostModel,
      isArray: true,
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      type: BadRequestType,
      description: 'Плохой запроос или не найдены данные',
    }),
    UseInterceptors(CacheInterceptor),
    CacheKey('articles'),
    CacheTTL(600),
    Get('all'),
  );

export const ApiGetOneArticleOneById = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получение по уникальному значению',
      description: 'Получение одного поста по айди',
    }),
    ApiOkResponse({
      status: HttpStatus.OK,
      type: SwagPostModel,
      isArray: true,
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      type: BadRequestType,
      description: 'Плохой запроос или айди не найден',
    }),
    UseInterceptors(CacheInterceptor),
    CacheTTL(600),
    Get('get/:id'),
    CacheKey('article' + ':id'),
  );

export const ApiGetManyArticlesByPagination = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получение отсортированных',
      description: 'Для получения сортированных постов',
    }),
    ApiOkResponse({
      status: HttpStatus.OK,
      type: SwagPostModel,
      description: 'Отдает фильтрованные посты по бд',
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      type: BadRequestType,
      description: 'Плохой запроос или не найдены данные',
    }),
    UseInterceptors(CacheInterceptor),
    CacheKey('articles-pagination'),
    CacheTTL(60000),
    Get('pagination'),
  );

export const ApiGetManyArticlesByParams = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получение отсортированных по параметру фильтров',
      description: 'Для получения сортированных постов',
    }),
    ApiOkResponse({
      status: HttpStatus.OK,
      isArray: true,
      description: 'Отдает отстортирование по квери данным - посты по бд',
      type: SwagPostModel,
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      type: BadRequestType,
      description: 'Плохой запроос или не найдены данные',
    }),
    ApiQuery({ type: 'string', required: false, name: 'author' }),
    ApiQuery({ type: 'Date', required: false, name: 'start' }),
    ApiQuery({ type: 'Date', required: false, name: 'end' }),
    ApiQuery({
      type: 'string',
      required: false,
      name: 'categories',
      example: '1,2,3',
    }),
    UseInterceptors(CacheInterceptor),
    CacheTTL(30000),
    Get('filter'),
  );

export const ApiPatchOneArticle = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Обновление по уникальному значению',
      description: 'Для обновления поста по айди',
    }),
    ApiOkResponse({
      status: HttpStatus.GONE,
      type: SwagPostModel,
      description: 'Обновляет сущность созданную по бд',
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      type: BadRequestType,
      description: 'Плохой запроос или айди не найден',
    }),
    UseGuards(AccessGuard),
    Patch('/:id'),
  );

export const ApiDeleteOneArticle = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Удаление по уникальному значению',
      description: 'Для удаления поста по айди',
    }),
    ApiOkResponse({
      status: HttpStatus.ACCEPTED,
      type: Boolean,
      description: 'Отдает статус успешно',
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      type: Boolean,
      description: 'Плохой запроос или айди не найден',
    }),
    UseGuards(AccessGuard, RoleGuard),
    Roles(Role.ADMIN, Role.USER),
    Delete('/:id'),
  );
