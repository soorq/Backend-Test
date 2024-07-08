import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { EUser } from '@/core/domain/entities';
import { CreateUserDto } from '@/shared/crud';
import { UpdateUserDto } from '@/shared/crud';
import { Cache } from 'cache-manager';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(EUser)
    private readonly db: Repository<EUser>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  create = async (dto: CreateUserDto) => {
    await this.cacheManager.reset();
    try {
      const isExist = await this.findByEmail(dto.email);

      if (isExist) {
        throw new HttpException('Уже есть такой юзер', HttpStatus.BAD_REQUEST);
      }

      const user = this.db.create(dto);

      return this.db.save(user);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  };

  update = async (id: string, dto: UpdateUserDto) => {
    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new HttpException(
          'Такого юзера не найдено',
          HttpStatus.NOT_FOUND,
        );
      }

      const res = await this.db.update(id, { ...dto });

      if (!res.affected) {
        throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
      }

      return { message: 'Успешно', data: user };
    } catch (error) {
      throw new HttpException(
        error.response || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  delete = async (id: string) => {
    await this.cacheManager.reset();
    try {
      const user = await this.findOne(id);

      if (!user) {
        throw new HttpException(
          'Такого юзера не найдено',
          HttpStatus.NOT_FOUND,
        );
      }

      const res = await this.db.delete(id);

      if (!res.affected) {
        throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
      }

      return { message: 'Успешно', status: 200, data: null };
    } catch (error) {
      // Handle specific delete failure
      if (error.message === 'Failed to delete') {
        throw new HttpException('Плохой запрос', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        error.response || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  };

  /**
   * @email {string} - Почта, по ней происходит. Значение - ключ.
   * @withPassword {optional} {boolean} - для выделения в сущности пароля, для auth service был введен параметр, чтобы не получить ошибку argon phnstr - is emnty
   */
  public findByEmail = async (email: string, withPassword?: boolean) => {
    return this.db
      .findOne({
        where: { email },
        select: {
          password: withPassword ?? false,
          email: true,
          role: true,
          id: true,
        },
      })
      .catch(() => {
        throw new HttpException(
          'Ошибка со стороны TypeOrm',
          HttpStatus.BAD_GATEWAY,
        );
      });
  };

  /**
   * @id - string - Юзер айди
   * @cached - boolean - для того что бы auth service мог брать не кэшированного юзера
   * @withRelations - boolean - добавлять ли связи
   */
  public findOne = async (
    id: string,
    cached: boolean = true,
    withRelations?: boolean,
  ): Promise<EUser> => {
    const cachedUser = await this.cacheManager.get('get-user');

    if (cachedUser && cached) return cachedUser as EUser;

    return this.db
      .findOne({
        where: { id },
        relations: {
          token: withRelations ?? false,
          posts: withRelations ?? false,
        },
      })
      .then((user) => {
        return user;
      })
      .catch(() => {
        throw new HttpException(
          'Ошибка со стороны TypeOrm',
          HttpStatus.BAD_GATEWAY,
        );
      });
  };

  public findAll = async () => {
    const cachedUsers = await this.cacheManager.get('get-users');

    if (cachedUsers) return cachedUsers;

    return this.db.find().catch(() => {
      throw new HttpException(
        'Ошибка со стороны TypeOrm',
        HttpStatus.BAD_GATEWAY,
      );
    });
  };

  /**
   * @firstname - string - Юзер айди
   * @withRelations - boolean - добавлять ли связи
   * */
  public findOneByFirstname = async (
    first_name: string,
    withRelations?: boolean,
  ) => {
    return this.db
      .findOne({
        where: { first_name },
        relations: { token: withRelations ?? false },
      })
      .catch(() => {
        throw new HttpException(
          'Ошибка со стороны TypeOrm',
          HttpStatus.BAD_GATEWAY,
        );
      });
  };
}
