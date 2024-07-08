import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TokenService } from '@/infra/framework/token/token.service';
import type { CreateUserDto, LoginDto } from '@/shared/crud';
import { UserService } from '../user/user.service';
import type { Response } from 'express';
import { verify, hash } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly token: TokenService,
    private readonly user: UserService,
  ) {}

  signUp = async (dto: CreateUserDto, res: Response) => {
    const userExists = await this.user.findOneByFirstname(dto.first_name);

    if (userExists) {
      throw new HttpException(
        'Юзер с таким логином уже существует!',
        HttpStatus.FORBIDDEN,
      );
    }

    const hash = await this.hashData(dto.password);

    const newUser = await this.user.create({
      ...dto,
      password: hash,
    });

    const token = await this.token.create(newUser.id, newUser.role);

    await this.user.update(newUser.id, { token: token });

    res.cookie('_rf', token.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 60,
      secure: true,
    });

    return { access: token.access };
  };

  signIn = async (dto: LoginDto, res: Response) => {
    const user = await this.user.findByEmail(dto.email, true);

    if (!user) {
      throw new HttpException(
        'Неверная почта или пароль',
        HttpStatus.BAD_REQUEST,
      );
    }

    const matchPassword = await verify(user.password, dto.password);

    if (!matchPassword) {
      throw new HttpException(
        'Неверная почта или пароль',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { access, refresh, ...token } = await this.token.create(
      user.id,
      user.role,
    );

    await this.user.update(user.id, { token });

    res.clearCookie('_rf');
    res.cookie('_rf', refresh, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      secure: true,
      sameSite: 'none',
      httpOnly: true,
    });

    return { access };
  };

  logout = async (id: string, res: Response) => {
    const token = await this.token.findOneByUserId(id);

    if (!token)
      throw new HttpException(
        'Нету сессии. Залогиньтесь',
        HttpStatus.BAD_REQUEST,
      );

    await this.token.delete(token?.id);

    res.clearCookie('_rf', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return true;
  };

  refresh = async (id: string, token: string, res: Response) => {
    const user = await this.user.findOne(id, false, true);

    if (!user || user?.token?.token !== token) {
      throw new HttpException('Не верная сессия', HttpStatus.BAD_REQUEST);
    }

    const tokens = await this.token.tokenWorker(user.id, user.role);

    res.cookie('_rf', tokens.refresh, {
      httpOnly: true,
      maxAge: 60 * 60 * 60,
      secure: true,
    });

    return { access: tokens.access };
  };

  hashData = async (data: string) => {
    return hash(data);
  };
}
