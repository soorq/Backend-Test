import { ApiProperty } from '@nestjs/swagger';

export class BadRequestType {
  @ApiProperty({ type: 'string', description: 'Сообщение об ошибке' })
  message: string;

  @ApiProperty({ type: 'number', description: 'HTTP статус ошибки' })
  status: number;
}
