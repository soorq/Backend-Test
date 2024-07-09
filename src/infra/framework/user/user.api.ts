import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SwagUserModel } from '@/core/base/swagger-models/user.model';
import { ApiResponseModel } from '@/shared/helpers/api.helper';
import { AccessGuard, RoleGuard } from '@/shared/guards';
import { Roles } from '@/core/domain/decorator';
import { Role } from '@/shared/roles';
import {
  applyDecorators,
  Delete,
  Get,
  HttpStatus,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BadRequestType } from '@/core/base/swagger-models/bad-request.model';

export const ApiGetOneUser = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Получение одного юзера, по индефикатору',
      description: 'Получение одного юзера, по индефикатору',
    }),
    ApiOkResponse({
      status: HttpStatus.OK,
      description: 'Отдает отстортирование по квери данным - посты по бд',
      type: SwagUserModel,
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      type: BadRequestType,
    }),
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
    ApiOkResponse({
      status: HttpStatus.OK,
      description: 'Отдает отстортирование по квери данным - посты по бд',
      isArray: true,
      type: SwagUserModel,
    }),
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      type: BadRequestType,
    }),
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
    ApiBadRequestResponse({
      status: HttpStatus.BAD_REQUEST,
      type: Boolean,
    }),
    UseGuards(AccessGuard, RoleGuard),
    Roles(Role.ADMIN, Role.USER),
    ApiConsumes('application/json'),
    Delete('/:id'),
  );
