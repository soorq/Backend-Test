import { TokenService } from '@/infra/framework/token/token.service';
import { TokenScheduleService } from './token.schedule';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EToken } from '@/core/domain/entities';
import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([EToken]),
    ScheduleModule.forRoot(),
    JwtModule.register({ global: true }),
  ],
  providers: [TokenService, TokenScheduleService, Logger],
  exports: [TokenService],
})
export class TokenModule {}
