import { CategoryController } from './category.controller';
import { AccessContorlService } from '@/shared/roles';
import { CategoryService } from './category.service';
import { ECategory } from '@/core/domain/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([ECategory])],
  controllers: [CategoryController],
  providers: [CategoryService, AccessContorlService],
  exports: [CategoryService],
})
export class CategoryModule {}
