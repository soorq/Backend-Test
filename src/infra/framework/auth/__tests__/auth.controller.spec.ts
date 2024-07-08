import { AuthController } from '@/infra/framework/auth/auth.controller';
import { AuthService } from '@/infra/framework/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { mockAuthService } from './mock/service.mock';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AuthController', () => {
  let authService: jest.Mocked<AuthService>;
  let authController: AuthController;
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
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
      controllers: [AuthController],
    }).compile();

    authService = module.get(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});
