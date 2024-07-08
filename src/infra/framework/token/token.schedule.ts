import { Cron, CronExpression } from '@nestjs/schedule';
import { Injectable, Logger } from '@nestjs/common';
import { TokenService } from './token.service';

@Injectable()
export class TokenScheduleService {
  constructor(
    private readonly logger: Logger,
    private readonly tokenService: TokenService,
  ) {}

  @Cron(CronExpression.EVERY_6_HOURS)
  public async deleteExpiredTokens() {
    this.logger.debug('Удаление истекших токенов.');
    const count = await this.tokenService.deleteExpiredTokens();
    this.logger.debug(`Удалено ${count} не активных сессий`);
  }
}
