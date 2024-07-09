import { HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EToken } from '@/core/domain/entities';
import { ConfigService } from '@nestjs/config';
import type { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@/shared/roles';

export class TokenService {
  private readonly access_sign: string;
  private readonly refresh_sign: string;

  constructor(
    @InjectRepository(EToken)
    private readonly token_repository: Repository<EToken>,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {
    this.access_sign = this.cfg.get<string>('JWT_ACCESS_SECRET');
    this.refresh_sign = this.cfg.get<string>('JWT_REFRESH_SECRET');
  }

  public create = async (userId: string, role: Role) => {
    try {
      const isExist = await this.findOneByUserId(userId);
      const tokens = await this.generateTokens(userId, role);
      if (isExist) {
        await this.update(isExist.id, { token: tokens.refresh });

        return { ...isExist, access: tokens.access, refresh: tokens.refresh };
      }

      const token = await this.token_repository.save({
        token: tokens.refresh,
        user: { id: userId },
      });

      return { ...token, access: tokens.access, refresh: tokens.refresh };
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_GATEWAY);
    }
  };

  public findOneByToken = async (token: string): Promise<EToken> => {
    try {
      return this.token_repository.findOne({ where: { token } });
    } catch (e) {
      throw new HttpException('', HttpStatus.BAD_GATEWAY);
    }
  };

  public findOneByUserId = async (id: string): Promise<EToken> => {
    return this.token_repository
      .findOne({ where: { user: { id } } })
      .catch((e) => {
        throw new HttpException(e, HttpStatus.BAD_GATEWAY);
      });
  };

  public update = async (id: string, dto: { token: string }) => {
    return this.token_repository.update(id, dto).catch((e) => {
      throw new HttpException(e.message, e.status);
    });
  };

  public tokenWorker = async (id: string, role: Role) => {
    const { access, refresh } = await this.generateTokens(id, role);

    const token = await this.findOneByUserId(id);

    await this.update(token.id, { token: refresh });

    return { access, refresh };
  };

  public delete = async (id: string) => {
    return this.token_repository.delete(id).catch((e) => {
      throw new HttpException(e.message, e.status);
    });
  };

  public deleteExpiredTokens = async () => {
    // const mock15MinuteDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 15);
    const fifteenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 15);
    const qb = this.token_repository.createQueryBuilder('token');
    return qb
      .where('createdAt < :fifteenDaysAgo', { fifteenDaysAgo })
      .delete()
      .execute()
      .then((result) => result.affected || 0);
  };

  private generateTokens = async (userId: string, role: Role) => {
    const payload = { sub: userId, role };
    const [access, refresh] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.access_sign,
        expiresIn: '15m',
      }),
      this.jwt.signAsync(payload, {
        secret: this.refresh_sign,
        expiresIn: '2d',
      }),
    ]);

    return {
      access,
      refresh,
    };
  };
}
