import { TokenService } from '@/infra/framework/token/token.service';
import { EToken, EUser } from '@/core/domain/entities';
import { Role } from '@/shared/roles';

export type ETokenWithoutUserToken = Omit<EToken, 'user'> & {
  user: Omit<EUser, 'token'>;
};

export const mockToken: ETokenWithoutUserToken = {
  id: 'token-id',
  token: 'existing-token',
  user: {
    id: 'user-id',
    first_name: 'John',
    last_name: 'Doe',
    img: 'avatar.jpg',
    age: ' 30',
    updatedAt: new Date(),
    createdAt: new Date(),
    role: Role.USER,
    email: 'test@test.com',
    password: 'test',
    posts: [],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockJwtService = {
  sign: jest.fn().mockImplementation(() => {
    return 'mocked-token';
  }),
  verify: jest.fn(),
};

export const mockTokenService: Partial<TokenService> = {
  tokenWorker: jest.fn(),
  findOneByUserId: jest.fn(),
  update: jest.fn(),
  create: jest.fn(),
  findOneByToken: jest.fn(),
  deleteExpiredTokens: jest.fn(),
  delete: jest.fn(),
};

export const mockDataSource = {
  findOne: jest.fn().mockResolvedValue(mockToken),
  save: jest.fn().mockResolvedValue(mockToken),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
  createQueryBuilder: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue({ affected: 1 }),
  }),
};

export const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_ACCESS_SECRET') {
      return 'mock-access-secret';
    } else if (key === 'JWT_REFRESH_SECRET') {
      return 'mock-refresh-secret';
    }
    return undefined;
  }),
};
