import { PostService } from '@/infra/framework/post/post.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { mockPostService } from './mock/service.mock';
import { Test, TestingModule } from '@nestjs/testing';

describe('PostService', () => {
  let postService: PostService = undefined;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: PostService, useValue: mockPostService },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: () => 'any value',
            set: () => jest.fn(),
          },
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });
});
