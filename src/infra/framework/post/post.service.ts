import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import type { CreatePostDto, UpdatePostDto } from '@/shared/crud';
import { CategoryService } from '../category/category.service';
import type { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import {
  type IPaginationOptions,
  type Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { EPost } from '@/core/domain/entities';

@Injectable()
export class PostService {
  private readonly log: Logger;

  private postDb: Repository<EPost>;

  constructor(
    @InjectDataSource()
    private _ds: DataSource,

    private readonly category: CategoryService,
    private readonly user: UserService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    this.postDb = this._ds.getRepository(EPost);
  }

  public create = async (dto: CreatePostDto, userId: string) => {
    const queryRunner = this._ds.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isExist = await this.findByUser(userId, dto.link);

      if (isExist) {
        throw new HttpException('Уже есть такой пост', HttpStatus.BAD_REQUEST);
      }

      const user = await this.user.findOne(userId);
      const category = await this.category.findAll();
      const c = category.filter((item) =>
        dto.category_ids.includes(item.id.toString()),
      );

      const post = queryRunner.manager.create(EPost, dto);

      post.category = c;
      post.user = user;

      if (category.length === 0) {
        throw new HttpException(
          'Создайте категории прежде чем использовать!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const res = await this.postDb.save(post, { transaction: true });

      await queryRunner.commitTransaction();

      await this.cacheManager.set('article' + post.id, post);
      await this.cacheManager.del('articles');
      await this.cacheManager.del('articles-pagination');

      return { message: 'Успешно создан', status: 200, data: res };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  };

  public findAll = async () => {
    const cachedPosts = await this.cacheManager.get('articles');

    if (cachedPosts) return cachedPosts;

    return this.postDb
      .find({
        relations: {
          category: true,
          user: true,
        },
      })
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      });
  };

  public findOne = async (id: string) => {
    const cached = await this.cacheManager.get(`article-${id}}`);

    if (cached) return cached;
    return this.postDb
      .findOne({
        where: { id },
        relations: { category: true, user: true },
      })
      .then((post) => {
        if (!post) {
          throw new HttpException('Такой пост не найден', HttpStatus.NOT_FOUND);
        }

        this.cacheManager.set('article' + post.id, post);
        return post;
      })
      .catch((e) => {
        throw new HttpException(e.message, e.status);
      });
  };

  public filters = async (filters: {
    authorId?: string;
    startDate?: Date;
    endDate?: Date;
    categoryIds?: string[];
  }) => {
    try {
      Logger.log(
        `Filters: ${JSON.stringify(filters)}`,
        'PostService - filters',
      );

      const qb = this.postDb
        .createQueryBuilder('q')
        .leftJoinAndSelect('q.user', 'user')
        .leftJoinAndSelect('q.category', 'category')
        .orderBy('q.createdAt', 'DESC');

      if (filters.authorId) {
        qb.andWhere('q.user.id = :authorId', { authorId: filters.authorId });
      }

      if (filters.startDate) {
        qb.andWhere('q.createdAt >= :startDate', {
          startDate: filters.startDate,
        });
      }

      if (filters.endDate) {
        qb.andWhere('q.createdAt <= :endDate', { endDate: filters.endDate });
      }

      if (filters.categoryIds && filters.categoryIds.length > 0) {
        qb.andWhere('category.id IN (:...categoryIds)', {
          categoryIds: filters.categoryIds,
        });
      }
      Logger.log(`SQL Query: ${qb.getSql()}`, 'PostService - filters');

      const posts = await qb.getMany();

      return posts;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  public pagination = async (
    opt: IPaginationOptions,
  ): Promise<Pagination<EPost> | unknown> => {
    try {
      const cachedPosts = await this.cacheManager.get('articles-pagination');

      if (cachedPosts) {
        return cachedPosts;
      }

      const qb = this.postDb
        .createQueryBuilder('q')
        .leftJoinAndSelect('q.user', 'user')
        .leftJoinAndSelect('q.category', 'category')
        .orderBy('q.createdAt', 'DESC');

      return paginate(qb, {
        ...opt,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  public update = async (id: string, { category, ...rest }: UpdatePostDto) => {
    try {
      const post = await this.findOne(id);

      if (!post) {
        throw new HttpException('Такой пост не найден', HttpStatus.NOT_FOUND);
      }

      const res = await this.postDb.update(id, { ...rest, category });

      if (!res) {
        throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
      }

      await this.cacheManager.del('article' + id);

      return { message: 'Успешно', data: post };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  };

  public delete = async (id: string) => {
    try {
      const post = await this.findOne(id);

      if (!post) {
        throw new HttpException('Такой пост не найден', HttpStatus.NOT_FOUND);
      }

      const res = await this.postDb.delete(id);

      if (!res) {
        throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
      }

      await this.cacheManager.reset();

      return { message: 'Успешно', data: null };
    } catch (error) {
      throw new HttpException(error.response, error.status);
    }
  };

  private findByUser = async (id: string, link: string) => {
    return this.postDb
      .findOne({
        where: { user: { id }, link },
      })
      .catch((error) => {
        throw new HttpException(error.message, error.status);
      });
  };
}
