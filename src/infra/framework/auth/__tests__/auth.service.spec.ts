import { AuthService } from '@/infra/framework/auth/auth.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { mockAuthService } from './mock/service.mock';

describe('AuthService', () => {
  let authService: AuthService = undefined;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
