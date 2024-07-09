import { EUser } from '@/core/domain/entities/user.entity';
import { AccessContorlService } from '@/shared/roles';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([EUser])],
  controllers: [UserController],
  providers: [UserService, AccessContorlService],
  exports: [UserService],
})
export class UserModule {}
