import { ApiProperty } from '@nestjs/swagger';

export class AuthModelResponse {
  @ApiProperty({
    type: 'string',
    description: 'Уникальный идентификатор поста',
  })
  access: string;
}
