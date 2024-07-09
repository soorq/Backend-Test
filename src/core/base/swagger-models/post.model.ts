import { ECategory, EUser } from '@/core/domain/entities';
import { ApiProperty } from '@nestjs/swagger';

export class SwagPostModel {
  @ApiProperty({
    type: 'string',
    description: 'Уникальный идентификатор поста',
  })
  id: string;

  @ApiProperty({ type: 'string', description: 'Заголовок поста' })
  title: string;

  @ApiProperty({ type: 'string', description: 'Описание поста' })
  desc: string;

  @ApiProperty({ type: 'string', description: 'Ссылка на пост' })
  link: string;

  @ApiProperty({ type: 'string', description: 'Город' })
  city: string;

  @ApiProperty({
    type: () => EUser,
    description: 'Пользователь, создавший пост',
  })
  user: EUser;

  @ApiProperty({
    type: () => [ECategory],
    description: 'Категории, к которым относится пост',
  })
  category: ECategory[];

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата создания поста',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Дата последнего обновления поста',
  })
  updatedAt: Date;
}
