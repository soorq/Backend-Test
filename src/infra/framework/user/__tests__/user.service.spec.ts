import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from '../user.service';
import { EUser } from '@/core/domain/entities';
import { Repository } from 'typeorm';
import {
  dto,
  testUserArray,
  updateDto,
  updatedUser,
  userOne,
} from './mocks/service.mock';

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<EUser>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            reset: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(EUser),
          useValue: {
            find: jest.fn().mockResolvedValue(testUserArray),
            findOne: jest.fn().mockResolvedValue(userOne),
            create: jest.fn().mockReturnValue(userOne),
            save: jest.fn().mockResolvedValue(userOne),
            update: jest.fn().mockResolvedValue(true),
            delete: jest.fn().mockResolvedValue({ affected: 1 }),
            findOneBy: jest.fn().mockResolvedValue(userOne),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<EUser>>(getRepositoryToken(EUser));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = await service.findAll();
      expect(users).toEqual(testUserArray);
    });
  });

  describe('findOne', () => {
    it('should get a single user by ID', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne');
      const userId = 'id';

      await expect(service.findOne(userId)).resolves.toEqual(userOne);

      expect(repoSpy).toBeCalledWith(
        expect.objectContaining({
          where: { id: userId },
          select: { password: false },
        }),
      );
    });

    it('should get a single user by ID with relations', async () => {
      const repoSpy = jest.spyOn(repo, 'findOne');
      await expect(service.findOne('id', true)).resolves.toEqual(userOne);
      expect(repoSpy).toBeCalledWith(
        expect.objectContaining({
          where: { id: 'id' },
          relations: expect.anything(),
          select: { password: false },
        }),
      );
    });
  });

  describe('create', () => {
    const { password, ...userOneWithoutPassword } = userOne;

    it('should successfully insert a user', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);
      const result = await service.create(dto);

      expect(result).toEqual(userOneWithoutPassword);
      expect(repo.create).toBeCalledWith(dto);
      expect(repo.save).toBeCalledTimes(1);
    });

    it('should throw BadRequest exception if user exists', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(userOne);

      await expect(service.create(dto)).rejects.toThrowError(
        'Уже есть такой юзер',
      );
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const userId = 'id';

      jest.spyOn(service, 'findOne').mockResolvedValue(userOne);
      jest
        .spyOn(repo, 'update')
        .mockResolvedValue({ affected: 1, raw: {}, generatedMaps: null });
      jest.spyOn(repo, 'findOneBy').mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateDto);

      expect(result.message).toEqual('Успешно');
      expect(result.data).toEqual({
        ...updatedUser,
        first_name: 'Updated Name', // Adjust as per your expected first_name
      });
      expect(repo.update).toBeCalledWith(userId, updateDto);
      expect(repo.findOneBy).toBeCalledWith({ id: userId });
    });

    it('should throw NotFound exception if user does not exist', async () => {
      const userId = 'non-existent-id';

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(service.update(userId, updateDto)).rejects.toThrowError(
        'Такого юзера не найдено',
      );
      expect(repo.update).not.toBeCalled();
      expect(repo.findOneBy).not.toBeCalled();
    });

    it('should throw BadRequest exception on failed update', async () => {
      const userId = 'user-id';

      jest.spyOn(service, 'findOne').mockResolvedValue(userOne);
      jest
        .spyOn(repo, 'update')
        .mockResolvedValue({ affected: 0, raw: {}, generatedMaps: null });

      await expect(service.update(userId, updateDto)).rejects.toThrowError(
        'Плохой запрос',
      );
      expect(repo.update).toBeCalledWith(userId, updateDto);
      expect(repo.findOneBy).not.toBeCalled();
    });

    it('should handle internal server error', async () => {
      const userId = 'user-id';

      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.update(userId, updateDto)).rejects.toThrowError(
        'Internal server error',
      );
      expect(repo.update).not.toBeCalled();
      expect(repo.findOneBy).not.toBeCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      const result = await service.delete('a uuid');
      expect(result).toEqual({ message: 'Успешно', status: 200, data: null });
      expect(repo.delete).toBeCalledWith('a uuid');
    });

    it('should throw NotFound exception if user does not exist', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);
      await expect(service.delete('non-existent-id')).rejects.toThrowError(
        'Такого юзера не найдено',
      );
    });

    it('should handle delete method failure', async () => {
      jest
        .spyOn(repo, 'delete')
        .mockRejectedValueOnce(new Error('Failed to delete'));
      await expect(service.delete('a uuid')).rejects.toThrowError(
        'Плохой запрос',
      );
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const result = await service.findByEmail(email);
      expect(result).toEqual(userOne);
      expect(repo.findOneBy).toBeCalledWith({ email });
    });

    it('should throw a HttpException on TypeORM error', async () => {
      jest
        .spyOn(repo, 'findOneBy')
        .mockRejectedValueOnce(new Error('TypeORM error'));
      const email = 'test@example.com';
      await expect(service.findByEmail(email)).rejects.toThrowError(
        'Ошибка со стороны TypeOrm',
      );
    });
  });
});
