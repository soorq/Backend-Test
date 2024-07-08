import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { mockUserService, testUserArray, userOne } from './mocks/service.mock';

describe('UserController', () => {
  let service: jest.Mocked<UserService>;
  let controller: UserController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
      controllers: [UserController],
    }).compile();

    service = module.get(UserService);
    controller = module.get<UserController>(UserController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOne', () => {
    it('should get a user by id', async () => {
      const userId = 'a_strange_id';

      jest.spyOn(service, 'findOne').mockResolvedValue(userOne);

      const result = await controller.getOne(userId);

      expect(result).toEqual(userOne);
      expect(service.findOne).toBeCalledWith(userId);
    });
  });

  describe('getAll', () => {
    it('should get an array of users', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(testUserArray);

      const result = await controller.getAll();

      expect(result).toEqual(testUserArray);
      expect(service.findAll).toBeCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      const userId = 'a_strange_id';
      const deleteResult = { message: 'Успешно', status: 200, data: null };

      jest.spyOn(service, 'delete').mockResolvedValue(deleteResult);

      const result = await controller.delete(userId);

      expect(result).toEqual(deleteResult);
      expect(service.delete).toBeCalledWith(userId);
    });
  });
});
