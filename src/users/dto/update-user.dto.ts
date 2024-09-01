import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { USER_ROLES } from 'src/auth/auth.interfaces';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserRoleDto {
    @ApiProperty({description: 'The role of the user'})
    @IsNotEmpty({message: 'role is required'})
    role: USER_ROLES
}
