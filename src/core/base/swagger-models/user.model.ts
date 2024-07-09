import { EToken } from '@/core/domain/entities';
import { ApiProperty } from '@nestjs/swagger';
import { SwagPostModel } from './post.model';
import { Role } from '@/shared/roles';

export class SwagUserModel {
  @ApiProperty({
    type: 'string',
    description: 'Уникальный идентификатор пользователя',
  })
  id: string;

  @ApiProperty({ type: 'string', description: 'Имя пользователя' })
  first_name: string;

  @ApiProperty({ type: 'string', description: 'Фамилия пользователя' })
  last_name: string;

  @ApiProperty({
    type: 'string',
    description: 'Ссылка на изображение пользователя',
  })
  img: string;

  @ApiProperty({ type: 'string', description: 'Возраст пользователя' })
  age: string;

  @ApiProperty({
    type: 'enum',
    enum: Role,
    description: 'Роль пользователя',
    default: Role.USER,
  })
  role: Role;

  @ApiProperty({
    type: 'string',
    description: 'Электронная почта пользователя',
    format: 'email',
  })
  email: string;

  @ApiProperty({
    type: () => [SwagPostModel],
    description: 'Посты, созданные пользователем',
  })
  posts: SwagPostModel[];

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата создания пользователя',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата последнего обновления пользователя',
  })
  updatedAt: Date;
}
