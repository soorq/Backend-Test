import {
  applyDecorators,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AccessGuard, RefreshGuard } from '@/shared/guards';
import { Public } from '@/core/domain/decorator';

// Public для метадаты, чтоб authguard jwt обойти, и получить доступ
export const SignUpDecorator = () =>
  applyDecorators(Post('signup'), Public(), HttpCode(201));

export const SignInDecorator = () =>
  applyDecorators(Post('signin'), Public(), HttpCode(200));

export const SignOutDecorator = () =>
  applyDecorators(UseGuards(AccessGuard), Get('logout'), HttpCode(200));

export const RefreshDecorator = () =>
  applyDecorators(UseGuards(RefreshGuard), Get('refresh'), HttpCode(200));
