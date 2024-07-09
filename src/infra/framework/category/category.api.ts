import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { AccessGuard, RoleGuard } from '@/shared/guards';
import { ECategory } from '@/core/domain/entities';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import {
  applyDecorators,
  Delete,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '@/core/domain/decorator';
import { Role } from '@/shared/roles';
import { BadRequestType } from '@/core/base/swagger-models/bad-request.model';
import { SwagCategoryModel } from '@/core/base/swagger-models/category.model';

export const ApiCreateOneCategory = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Создание сущности категории',
      description: 'Доступно только для админов',
    }),
    ApiOkResponse({
      status: HttpStatus.CREATED,
      type: SwagCategoryModel,
      description: 'Отдает сущность созданную админом по бд',
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      type: BadRequestType,
      description: 'Плохой запроос или ошибка при создании',
    }),
    Roles(Role.ADMIN),
    UseGuards(AccessGuard, RoleGuard),
    Post('/'),
  );

export const ApiGetAllCategories = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получение всех категорий',
      description: 'Получение всех категорий',
    }),
    ApiOkResponse({
      status: HttpStatus.OK,
      type: SwagCategoryModel,
      isArray: true,
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      type: BadRequestType,
      description: 'Плохой запроос или не найдены данные',
    }),
    UseInterceptors(CacheInterceptor),
    CacheKey('tabs'),
    CacheTTL(300),
    Get('all'),
  );

export const ApiGetOneCategoryOneById = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Поиск по айди',
      description: 'Получение по индефикатору',
    }),
    ApiOkResponse({
      status: HttpStatus.OK,
      type: SwagCategoryModel,
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
    CacheKey('tab' + ':id'),
  );

export const ApiDeleteOneCategory = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Удаление по айди',
      description: 'Удаление категории по индефикатору',
    }),
    ApiOkResponse({
      status: HttpStatus.ACCEPTED,
      type: SwagCategoryModel,
      description: 'Отдает статус успешно',
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      type: BadRequestType,
      description: 'Плохой запроос или айди не найден',
    }),
    Roles(Role.ADMIN),
    UseGuards(AccessGuard, RoleGuard),
    Delete('/:id'),
  );
