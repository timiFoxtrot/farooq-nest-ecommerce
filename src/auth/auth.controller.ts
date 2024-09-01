import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SuccessResponse } from 'src/common/helpers/response';
import { LoginDto } from './dto/login.dto';
import { SkipAuth } from './auth.decorator';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @SkipAuth()
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async userLogin(@Body() loginDto: LoginDto) {
    let data;
    let message = 'Login Successful';
    const user = await this.authService.validateUser(loginDto);
    data = await this.authService.createToken(user);

    return SuccessResponse(message, { data });
  }
}
