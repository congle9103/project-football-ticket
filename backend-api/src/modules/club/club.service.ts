import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { Repository } from 'typeorm';
import { Club } from './entities/club.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private readonly clubRepo: Repository<Club>,
  ) {}

  async create(createClubDto: CreateClubDto) {
    const newClub = this.clubRepo.create(createClubDto);
    return await this.clubRepo.save(newClub);
  }

  async findAll() {
    return await this.clubRepo.find();
  }

  async findOne(id: number) {
    const club = await this.clubRepo.findOneBy({ id });

    if (!club) {
      throw new NotFoundException('Club not found');
    }

    return club;
  }

  async update(id: number, updateClubDto: UpdateClubDto) {
    const existingClub = await this.clubRepo.findOneBy({ id });

    if (!existingClub) {
      throw new NotFoundException('Club not found');
    }

    await this.clubRepo.update(id, updateClubDto);

    return await this.clubRepo.findOneBy({ id });
  }

  async remove(id: number) {
    const club = await this.clubRepo.findOneBy({ id });

    if (!club) {
      throw new NotFoundException('Club not found');
    }

    await this.clubRepo.delete(id);

    return club;
  }
}
