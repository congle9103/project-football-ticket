import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(user: CreateUserDto) {
    // 1. Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const newUser = this.userRepo.create({
      ...user,
      password: hashedPassword,
    });

    return this.userRepo.save(newUser);
  }

  findAll() {
    const users = this.userRepo.find();
    return users;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, user: UpdateUserDto) {
    const existingUser = await this.userRepo.findOneBy({ id });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    await this.userRepo.update(id, user);
    return this.userRepo.findOneBy({ id });
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepo.delete(id);

    return user;
  }

  async findByUsername(username: string) {
    return this.userRepo.findOne({
      where: { username },
    });
  }

  async updateRefreshToken(userId: number, hashedRefreshToken: string) {
    await this.userRepo.update(userId, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }
}
