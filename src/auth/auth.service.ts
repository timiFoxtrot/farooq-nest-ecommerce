import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { USER_STATUS } from 'src/users/interfaces/users.enum';
import { validateHash } from 'src/common/utils';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<UserEntity> {
    const user = <UserEntity>await this.usersService.findActiveUser({
      email: loginDto.email,
      // status: USER_STATUS.ACTIVE,
    });

    if (!user) {
      throw new BadRequestException('Invalid credential');
    }

    if (user.status === USER_STATUS.BANNED) {
      throw new ForbiddenException('This account has been banned');
    }

    const isPasswordValid = await validateHash(
      loginDto.password,
      user?.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('No user found with given login details');
    }

    return user;
  }

  async createToken(user: UserEntity) {
    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const payload = { sub: user.id, user: userPayload };
    return {
      ...userPayload,
      token: await this.jwtService.sign(payload),
    };
  }
}
