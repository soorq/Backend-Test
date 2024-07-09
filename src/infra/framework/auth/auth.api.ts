import { BadRequestType } from '@/core/base/swagger-models/bad-request.model';
import { AuthModelResponse } from '@/core/base/swagger-models/auth.model';
import { AccessGuard, RefreshGuard } from '@/shared/guards';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@/core/domain/decorator';
import {
  applyDecorators,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';

// Public для метадаты, чтоб authguard jwt обойти, и получить доступ
export const SignUpDecorator = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Регистрация нового пользователя',
      description: 'Регистрирует нового пользователя с заданными данными.',
    }),
    ApiResponse({
      status: 201,
      description: 'Успешная регистрация',
      type: AuthModelResponse,
    }),
    ApiResponse({
      status: 400,
      description: 'Неверный запрос',
      type: BadRequestType,
    }),
    ApiResponse({
      status: 403,
      description: 'Такой юзер уже существует',
      type: BadRequestType,
    }),
    Post('signup'),
    Public(),
    HttpCode(201),
  );

export const SignInDecorator = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Вход пользователя',
      description:
        'Аутентифицирует пользователя по электронной почте и паролю.',
    }),
    ApiResponse({
      status: 201,
      description: 'Успешная вход',
      type: AuthModelResponse,
    }),
    ApiResponse({
      status: 400,
      description: 'Неверная почта или пароль',
      type: BadRequestType,
    }),
    Post('signin'),
    Public(),
    HttpCode(200),
  );

export const SignOutDecorator = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Выход пользователя',
      description: 'Завершает текущую сессию пользователя и удаляет токен.',
    }),
    ApiResponse({
      status: 201,
      description: 'Успешное завершение сессии',
      type: Boolean,
    }),
    ApiResponse({
      status: 400,
      description: 'Неверный запрос',
      type: BadRequestType,
    }),
    ApiResponse({
      status: 401,
      description: 'Не авторизован',
      type: BadRequestType,
    }),
    UseGuards(AccessGuard),
    Get('logout'),
    HttpCode(200),
  );

export const RefreshDecorator = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Обновление токена доступа',
      description:
        'Обновляет токен доступа для пользователя на основе текущего токена обновления.',
    }),
    ApiResponse({
      status: 201,
      description: 'Успешное обновление сессии',
      type: AuthModelResponse,
    }),
    ApiResponse({
      status: 400,
      description: 'Неверная пара токенов',
      type: BadRequestType,
    }),
    ApiResponse({
      status: 401,
      description: 'Не авторизован',
      type: BadRequestType,
    }),
    UseGuards(RefreshGuard),
    Get('refresh'),
    HttpCode(200),
  );
