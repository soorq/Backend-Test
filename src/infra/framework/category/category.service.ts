import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '@/shared/crud';
import type { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { ECategory } from '@/core/domain/entities';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(ECategory)
    private readonly categoryDb: Repository<ECategory>,
  ) {}

  create = async (dto: CreateCategoryDto) => {
    try {
      const isExist = await this.findByValue(dto.value);

      if (isExist) {
        throw new HttpException(
          'Уже есть такая категория',
          HttpStatus.BAD_REQUEST,
        );
      }
      const category = this.categoryDb.create(dto);

      await this.cacheManager.set('tab' + category.id, category);
      await this.cacheManager.del('tabs');

      return this.categoryDb.save(category);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  update = async (id: string, dto: UpdateCategoryDto) => {
    try {
      const category = await this.findOne(id);

      if (!category) {
        throw new HttpException(
          'Такая категория не найдена',
          HttpStatus.NOT_FOUND,
        );
      }

      const res = await this.categoryDb.update(id, { ...dto });

      if (!res) {
        throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
      }

      await this.cacheManager.del('tab' + id);

      return { message: 'Успешно', data: category };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  };

  delete = async (id: string) => {
    const category = await this.findOne(id);

    if (!category) {
      throw new HttpException(
        'Такая категория не найдена',
        HttpStatus.NOT_FOUND,
      );
    }

    const res = await this.categoryDb.delete(id).catch((error) => {
      throw new HttpException(error.response, error.status);
    });

    if (!res) {
      throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
    }

    await this.cacheManager.reset();

    return { message: 'Успешно', data: null };
  };

  public findAll = async (): Promise<ECategory[]> => {
    const cachedCategories = await this.cacheManager.get('tabs');

    if (cachedCategories) return cachedCategories as ECategory[];

    return this.categoryDb
      .find()
      .then((categories) => {
        if (!categories) {
          throw new HttpException('Ничего не найдено', HttpStatus.NOT_FOUND);
        }

        this.cacheManager.set('tabs', categories);

        return categories;
      })
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      });
  };

  public findOne = async (id: string): Promise<ECategory> => {
    const cached = await this.cacheManager.get(`tab-${id}}`);

    if (cached) return cached as ECategory;

    return this.categoryDb
      .findOne({ where: { id } })
      .then((category) => {
        if (!category) {
          throw new HttpException('Ничего не найдено', HttpStatus.NOT_FOUND);
        }

        this.cacheManager.set('tab' + category.id, category);

        return category;
      })
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      });
  };

  private findByValue = async (value: string) => {
    try {
      return this.categoryDb.findOneBy({ value });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };
}
