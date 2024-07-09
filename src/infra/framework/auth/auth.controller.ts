import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginDto } from '@/shared/crud';
import { Body, Controller, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import {
  RefreshDecorator,
  SignInDecorator,
  SignOutDecorator,
  SignUpDecorator,
} from '@/infra/framework/auth/auth.api';

@Controller('auth')
@ApiBearerAuth('Bearer')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @SignUpDecorator()
  signup(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.signUp(dto, res);
  }

  @SignInDecorator()
  signin(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.auth.signIn(data, res);
  }

  @SignOutDecorator()
  logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    return this.auth.logout(req.user['sub'], res);
  }

  @RefreshDecorator()
  refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req['user'];
    return this.auth.refresh(user.id, user.refresh, res);
  }
}
