import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepo: Repository<Staff>,
  ) {}

  async create(staff: CreateStaffDto) {
    // Hash password nếu staff có password
    const hashedPassword = await bcrypt.hash(staff.password, 10);

    const newStaff = this.staffRepo.create({
      ...staff,
      password: hashedPassword,
    });

    return this.staffRepo.save(newStaff);
  }

  findAll() {
    return this.staffRepo.find();
  }

  async findOne(id: number) {
    const staff = await this.staffRepo.findOneBy({ id });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    return staff;
  }

  async update(id: number, staff: UpdateStaffDto) {
    const existingStaff = await this.staffRepo.findOneBy({ id });

    if (!existingStaff) {
      throw new NotFoundException('Staff not found');
    }

    await this.staffRepo.update(id, staff);

    return this.staffRepo.findOneBy({ id });
  }

  async remove(id: number) {
    const staff = await this.staffRepo.findOneBy({ id });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    await this.staffRepo.delete(id);

    return staff;
  }

  async findByUsername(username: string) {
    return this.staffRepo.findOne({
      where: { username },
    });
  }

  async updateRefreshToken(staffId: number, hashedRefreshToken: string) {
    await this.staffRepo.update(staffId, {
      hashedRefreshToken: hashedRefreshToken,
    });
  }
}
