import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        url: cfg.get('REDIS_URL'),
        store: redisStore,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class CacheRedisModule {}
