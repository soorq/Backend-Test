import { UserService } from '@/infra/framework/user/user.service';
import { CreateUserDto, UpdateUserDto } from '@/shared/crud';
import { EUser } from '@/core/domain/entities';
import { Role } from '@/shared/roles';

export const mockUserService: Partial<UserService> = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByEmail: jest.fn(),
  findOneByFirstname: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

export const dto: CreateUserDto = {
  age: 'age',
  first_name: 'first_name',
  email: 'email@email.com',
  img: 'img',
  last_name: 'last_name',
  password: 'password',
  posts: null,
};

export const userOne: EUser = {
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
};

export const userTwo: EUser = {
  password: 'password',
  posts: null,
  token: null,
  role: Role.USER,
  img: 'img',
  email: 'email@email.com',
  id: 'id',
  age: 'age',
  first_name: 'Updated Name',
  last_name: 'last_name',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const testUserArray = [userOne, userTwo];

export const updateDto: UpdateUserDto = {
  ...userOne,
  first_name: 'Updated Name',
};

export const updatedUser = {
  ...userTwo,
};
