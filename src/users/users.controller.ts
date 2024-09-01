import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpStatus,
  Query,
  ParseBoolPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ErrorResponse, SuccessResponse } from 'src/common/helpers/response';
import { SearchDto } from './dto/query-user.dto';
import { SkipAuth } from 'src/auth/auth.decorator';
import { Roles } from 'src/auth/role.decorator';
import { USER_ROLES } from 'src/auth/auth.interfaces';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @SkipAuth()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const response = await this.usersService.create(createUserDto);
      return SuccessResponse('User Created Successfully', { data: response });
    } catch (error) {
      throw ErrorResponse(
        error.message || 'Unable to create user',
        error.status || HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Get()
  @Roles([USER_ROLES.ADMIN])
  async findAll(@Query() query: SearchDto) {
    try {
      const response = await this.usersService.findAll(query);
      return SuccessResponse('Users fetched Successfully', { data: response });
    } catch (error) {
      throw ErrorResponse(
        error.response || 'Unable to fetch users',
        error.status || HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Patch(':id')
  @Roles([USER_ROLES.ADMIN])
  async updateUserStatus(
    @Param('id') id: string,
    @Query('ban', ParseBoolPipe) ban: boolean,
  ) {
    try {
      console.log({ ban });
      const response = await this.usersService.updateUserStatus(id, ban);
      return SuccessResponse('Users status updated successfully', {
        data: response,
      });
    } catch (error) {
      throw ErrorResponse(
        error.response || 'Unable to update user status',
        error.status || HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
