import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { generateHash } from 'src/common/utils';
import { USER_STATUS } from './interfaces/users.enum';
import { SearchDto } from './dto/query-user.dto';
import { IReqUser, USER_ROLES } from 'src/auth/auth.interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async create(userInput: CreateUserDto) {
    const existingUser = await this.findUserByEmail(userInput.email);

    if (existingUser) {
      throw new HttpException('Email already taken', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = generateHash(userInput.password);
    const user = this.usersRepository.create({
      ...userInput,
      password: hashedPassword,
    });
    const createdUser = await this.usersRepository.save(user);

    if (!createdUser) {
      throw new HttpException(
        'Unable to create user at the moment, try again later!',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return createdUser;
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    return user;
  }

  async findActiveUser(findData: FindOptionsWhere<UserEntity>) {
    const user = this.usersRepository.findOne({
      where: {
        email: findData.email,
        status: findData.status,
      },
    });

    return user;
  }

  async findAll(searchParams: SearchDto) {
    let query = {};
    if (searchParams.status) {
      query['status'] = searchParams.status;
    }
    const users = await this.usersRepository.find({
      select: { id: true, name: true, email: true, role: true, status: true },
      where: { ...query },
    });
    return users;
  }

  async updateUserStatus(id: string, ban: boolean) {
    const status = ban ? USER_STATUS.BANNED : USER_STATUS.ACTIVE;
    const updatedUser = await this.usersRepository.update(id, { status });
    return updatedUser;
  }

  async updateUserRole(user_id: string, role: USER_ROLES, user: IReqUser) {
    if (user_id === user.id) {
      throw new HttpException(
        'You cannot update your own role',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    const updatedUser = await this.usersRepository.update(user_id, { role });
    return updatedUser;
  }

  async createAdminUser() {
    const payload = {
      name: process.env.ADMIN_NAME,
      password: generateHash(process.env.ADMIN_PASSWORD),
      email: process.env.ADMIN_EMAIL,
      role: USER_ROLES.ADMIN,
    };

    const existingAdmin = await this.usersRepository.findOne({
      where: { email: payload.email },
    });
    if (existingAdmin) {
      throw new HttpException(
        'Admin account already exists',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    const adminUser = this.usersRepository.create(payload);
    return this.usersRepository.save(adminUser);
  }
}
