import { CategoryController } from '@/infra/framework/category/category.controller';
import { CategoryService } from '@/infra/framework/category/category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CategoryController', () => {
  let categoryService: jest.Mocked<CategoryService>;
  let categoryController: CategoryController;
  let module: TestingModule;

  beforeEach(async () => {
    const categoryServiceMock: Partial<CategoryService> = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    };

    module = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
        {
          provide: CategoryService,
          useValue: categoryServiceMock,
        },
      ],
      controllers: [CategoryController],
    }).compile();

    categoryService = module.get(CategoryService);
    categoryController = module.get<CategoryController>(CategoryController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(categoryController).toBeDefined();
  });
});
