import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user' })
  @IsNotEmpty({ message: 'name is required' })
  @Transform((val) => val.value.trim())
  name: string;

  @ApiProperty({ description: 'The email address of the user' })
  @IsEmail()
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({ required: false, description: 'The password of the user' })
  @IsNotEmpty()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minNumbers: 1,
      minSymbols: 1,
      minUppercase: 1,
    },
    {
      message:
        'Password must contain at least 1 uppercase, 1 lowercase, a number, a special character, and minimum of 8 characters',
    },
  )
  password?: string;
}
