import { Controller, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiGetOneUser,
  ApiGetManyUsers,
  ApiDeleteOneUser,
} from '@/infra/framework/user/user.api';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly service: UserService) {}

  @ApiGetManyUsers()
  async getAll() {
    return this.service.findAll();
  }

  @ApiGetOneUser()
  async getOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiDeleteOneUser()
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
