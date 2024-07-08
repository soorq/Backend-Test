import { HttpLoggerMiddleware } from '@/core/domain/http.middleware';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { appDataSource } from '@/shared/configs/db/db.config';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CategoryModule } from './category/category.module';
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import { TokenModule } from './token/token.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    CacheModule.register({
      host: '0.0.0.0',
      store: redisStore,
      isGlobal: true,
      port: 6379,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => appDataSource.options,
      dataSourceFactory: async (opt) => {
        return new DataSource(opt).initialize();
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    CategoryModule,
    TokenModule,
    AuthModule,
    PostModule,
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useValue: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
