import { CategoryModule } from '../category/category.module';
import { AccessContorlService } from '@/shared/roles';
import { Module, forwardRef } from '@nestjs/common';
import { PostController } from './post.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EPost } from '@/core/domain/entities';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EPost]),
    forwardRef(() => CategoryModule),
    forwardRef(() => UserModule),
  ],
  controllers: [PostController],
  providers: [PostService, AccessContorlService],
})
export class PostModule {}
