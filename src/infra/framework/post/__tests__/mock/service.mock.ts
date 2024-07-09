import { PostService } from '@/infra/framework/post/post.service';
import { CreatePostDto, UpdatePostDto } from '@/shared/crud';
import { Role } from '@/shared/roles';

export const mockPostService: Partial<PostService> = {
  pagination: jest.fn(),
  filters: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
};

export const dto: CreatePostDto = {
  desc: 'test-desc',
  link: 'test-link',
  city: 'test-city',
  title: 'test-title',
  category_ids: ['1', '2'],
};

export const postOne = {
  id: 'test-post-two-id',
  city: 'test-post-two-city',
  link: 'test-post-two-link',
  desc: 'test-post-two-desc',
  title: 'test-post-two-title',
  createdAt: new Date(),
  updatedAt: new Date(),
  category: [{ id: '1', label: 'test-category', value: 'test-value' }],
  user: {
    password: 'password',
    posts: null,
    token: null,
    role: Role.USER,
    img: 'img',
    email: 'email@email.com',
    id: 'id',
    age: 'age',
    first_name: 'first_name',
    last_name: 'last_name',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const postTwo = {
  id: 'test-post-two',
  city: 'test-post-two-city',
  link: 'test-post-two',
  desc: 'test-post-two',
  title: 'test-post-two',
  createdAt: new Date(),
  updatedAt: new Date(),
  category: [{ id: '1', label: 'test-category', value: 'test-value' }],
  user: {
    password: 'password',
    posts: null,
    token: null,
    role: Role.USER,
    img: 'img',
    email: 'email@email.com',
    id: 'id',
    age: 'age',
    first_name: 'first_name',
    last_name: 'last_name',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

export const testPostArray = [postOne, postTwo];

export const updatePostDto = {
  desc: 'test-post-desc',
};

export const updatedPost = {
  ...postOne,
  desc: updatePostDto.desc,
  category: postOne.category.map((c) => ({ ...c })),
};
