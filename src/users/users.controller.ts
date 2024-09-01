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
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ErrorResponse, SuccessResponse } from 'src/common/helpers/response';
import { SearchDto } from './dto/query-user.dto';
import { SkipAuth } from 'src/auth/auth.decorator';
import { Roles } from 'src/auth/role.decorator';
import { RequestWithUser, USER_ROLES } from 'src/auth/auth.interfaces';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserRoleDto } from './dto/update-user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @SkipAuth()
  @ApiOperation({summary: 'Create a user'})
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'The created user' })
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
  @ApiOperation({summary: 'Fetch all user'})
  @ApiResponse({ status: 200, description: 'Users fetched successfully' })
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
  @ApiOperation({summary: 'Update user \'ban\' status'})
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  async updateUserStatus(
    @Param('id') id: string,
    @Query('ban', ParseBoolPipe) ban: boolean,
  ) {
    try {
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

  @Patch('/role/:id')
  @Roles([USER_ROLES.ADMIN])
  @ApiOperation({summary: 'Update user\'s role'})
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  async updateUserRole(@Param('id') id: string, @Body() body: UpdateUserRoleDto, @Req() req: RequestWithUser) {
    try {
      const response = await this.usersService.updateUserRole(id, body.role, req.user)
      return SuccessResponse('User role updated successfully', {
        data: response,
      });
    } catch (error) {
      throw ErrorResponse(
        error.response || 'Unable to update user role',
        error.status || HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  @Post('admin')
  @SkipAuth()
  @ApiOperation({summary: 'Create admin user'})
  @ApiResponse({ status: 201, description: 'Admin user successfully created' })
  async createAdminUser() {
    try {
      const response = await this.usersService.createAdminUser();
      return SuccessResponse('Admin User Created Successfully', { data: response });
    } catch (error) {
      throw ErrorResponse(
        error.message || 'Unable to create admin user',
        error.status || HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
