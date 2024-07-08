import { TokenService } from '@/infra/framework/token/token.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';

const mockTokenService: Partial<TokenService> = {
  tokenWorker: jest.fn(),
  findOneByUserId: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  findOneByToken: jest.fn(),
  deleteExpiredTokens: jest.fn(),
  delete: jest.fn(),
};

describe('Category Service', () => {
  let tokenService: TokenService = undefined;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: TokenService, useValue: mockTokenService },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });
});
