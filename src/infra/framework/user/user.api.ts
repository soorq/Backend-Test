import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { AccessGuard, RoleGuard } from '@/shared/guards';
import { Roles } from '@/core/domain/decorator';
import { UserResponse } from '@/shared/crud';
import { Role } from '@/shared/roles';
import {
  applyDecorators,
  Delete,
  Get,
  HttpStatus,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiResponseModel,
  ApiResponseStatus,
} from '@/shared/helpers/api.helper';

export const ApiGetOneUser = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получение одного юзера, по индефикатору',
      description: 'Получение одного юзера, по индефикатору',
    }),
    ApiResponseModel(HttpStatus.OK, 'Will return article', UserResponse),
    ApiResponseStatus(HttpStatus.NOT_FOUND, 'NOT_FOUND'),
    UseInterceptors(CacheInterceptor),
    CacheKey('get-user'),
    CacheTTL(300),
    Get('get/:id'),
  );

export const ApiGetManyUsers = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получение всех юзеров, которые были записаны в бд',
      description: 'Получение всех юзеров, которые были записаны в бд',
    }),
    ApiResponseModel(HttpStatus.OK, 'Will return many articles', UserResponse),
    ApiConsumes('multipart/form-data', 'application/json'),
    UseInterceptors(CacheInterceptor),
    CacheKey('get-users'),
    CacheTTL(600),
    Get('all'),
  );

export const ApiDeleteOneUser = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Удаление по уникальному значению (индифекатору)',
      description: 'Удаление юзера в бд записи по индифекатору',
    }),
    ApiResponseModel(
      HttpStatus.OK,
      'Will return article delete status',
      Boolean,
    ),
    UseGuards(AccessGuard, RoleGuard),
    Roles(Role.ADMIN, Role.USER),
    ApiConsumes('application/json'),
    Delete('/:id'),
  );
