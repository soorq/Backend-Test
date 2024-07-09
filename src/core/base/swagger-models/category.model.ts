import { ApiProperty } from '@nestjs/swagger';
import { EPost } from '@/core/domain/entities';

export class SwagCategoryModel {
  @ApiProperty({
    type: 'string',
    description: 'Уникальный идентификатор категории',
  })
  id: string;

  @ApiProperty({ type: 'string', description: 'Метка категории' })
  label: string;

  @ApiProperty({ type: 'string', description: 'Значение категории' })
  value: string;

  @ApiProperty({
    type: () => [EPost],
    description: 'Посты, относящиеся к этой категории',
  })
  post: EPost[];
}
