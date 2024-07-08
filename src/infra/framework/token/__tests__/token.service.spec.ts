import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TokenService } from '../token.service';
import { EToken } from '@/core/domain/entities';
import {
  mockConfigService,
  mockDataSource,
  mockJwtService,
  mockToken,
  mockTokenService,
} from './mock/service.mock';

import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
// const accessToken = jwtService.sign(
//   { sub: 'user-id', role: Role.USER },
//   { secret: 'access-secret', expiresIn: '15m' },
// );
//
// const refreshToken = jwtService.sign(
//   { sub: 'user-id', role: Role.USER },
//   { secret: 'refresh-secret', expiresIn: '7d' },
// );
describe('TokenService', () => {
  let service: TokenService;
  let module: TestingModule;
  let repo: Repository<EToken>;
  let jwtService: JwtService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: TokenService, useValue: mockTokenService },
        {
          provide: getRepositoryToken(EToken),
          useValue: mockDataSource,
        },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
    repo = module.get<Repository<EToken>>(getRepositoryToken(EToken));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByToken', () => {
    it('findOneByToken should return a token by token string', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockToken as EToken);
      const result = await service.findOneByToken('existing-token');
      expect(result).toEqual(mockToken);
      expect(repo.findOne).toBeCalledWith({
        where: { token: 'existing-token' },
      });
    });

    it('findOneByToken should throw HttpException on repository error', async () => {
      jest
        .spyOn(repo, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findOneByToken('exist-token')).rejects.toThrow(
        new HttpException('', HttpStatus.BAD_GATEWAY),
      );
    });
  });

  describe('findOneByUserId', () => {
    it('findOneByUserId should return a token by user ID', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(mockToken as EToken);
      const result = await service.findOneByUserId('user-id');
      expect(result).toEqual(mockToken);
      expect(repo.findOne).toBeCalledWith({
        where: { user: { id: 'user-id' } },
      });
    });

    it('findOneByUserId should throw HttpException on repository error', async () => {
      jest
        .spyOn(repo, 'findOne')
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findOneByUserId('user-id')).rejects.toThrow(
        new HttpException('', HttpStatus.BAD_GATEWAY),
      );
    });
  });
});
