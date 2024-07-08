import { PostController } from '@/infra/framework/post/post.controller';
import { PostService } from '@/infra/framework/post/post.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  mockPostService,
  postOne,
  testPostArray,
  updatedPost,
  updatePostDto,
} from './mock/service.mock';
import { EPost } from '@/core/domain/entities';
import { AccessContorlService } from '@/shared/roles';

describe('PostController', () => {
  let service: jest.Mocked<PostService>;
  let controller: PostController;
  let module: TestingModule;
  const postId = 'test-two-post-id';

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
          provide: PostService,
          useValue: mockPostService,
        },
        AccessContorlService
      ],
      controllers: [PostController],
    }).compile();

    service = module.get(PostService);
    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOne', () => {
    it('should get a post by id', async () => {
      const postId = 'a_post_id';

      jest.spyOn(service, 'findOne').mockResolvedValue(postOne);

      const result = await controller.getOne(postId);

      expect(result).toEqual(postOne);
      expect(service.findOne).toBeCalledWith(postId);
    });
  });

  describe('getAll', () => {
    it('should get an array of posts', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(testPostArray);

      const result = await controller.getAll();

      expect(result).toEqual(testPostArray);
      expect(service.findAll).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a post by id', async () => {
      const postId = 'a_post_id';

      jest.spyOn(service, 'update').mockResolvedValue({
        message: 'Successfully updated',
        data: updatedPost as EPost,
      });

      const result = await controller.update(postId, updatePostDto);

      expect(result).toEqual(updatedPost);
      expect(service.update).toHaveBeenCalledWith(postId, updatePostDto);
    });
  });

  describe('delete', () => {
    it('should delete a post by id', async () => {
      const deleteResult = {
        message: 'Успешно',
        status: 200,
        data: null,
      };

      jest.spyOn(service, 'delete').mockResolvedValue(deleteResult);

      const result = await controller.delete(postId);

      expect(result).toEqual(deleteResult);
      expect(service.delete).toBeCalledWith(postId);
    });
  });
});
