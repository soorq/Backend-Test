import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { UserResponse } from '@/shared/crud/user/user.response';
import { UpdateUserDto } from '@/shared/crud';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import {
  applyDecorators,
  Delete,
  Get,
  HttpStatus,
  Patch,
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

export const ApiPatchUser = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Обновление по уникальному значению (индифекатору)',
      description: 'Обновление юзера в бд записи по индифекатору',
    }),
    ApiResponseModel(
      HttpStatus.OK,
      'Will return article update status',
      Boolean,
    ),
    ApiResponseStatus(HttpStatus.NOT_FOUND, 'NOT_FOUND'),
    ApiConsumes('application/json'),
    ApiBody({ type: UpdateUserDto, required: true }),
    Patch('/:id'),
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
    ApiConsumes('application/json'),
    Delete('/:id'),
  );
