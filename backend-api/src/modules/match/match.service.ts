import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
  ) {}

  create(match: CreateMatchDto) {
    const newMatch = this.matchRepo.create(match);
    return this.matchRepo.save(newMatch);
  }

  findAll() {
    const matches = this.matchRepo.find();
    return matches;
  }

  async findOne(id: number) {
    const match = await this.matchRepo.findOneBy({ id });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    return match;
  }

  async update(id: number, match: UpdateMatchDto) {
    const existingMatch = await this.matchRepo.findOneBy({ id });
    if (!existingMatch) {
      throw new NotFoundException('Match not found');
    }
    await this.matchRepo.update(id, match);
    return this.matchRepo.findOneBy({ id });
  }

  async remove(id: number) {
    const match = await this.matchRepo.findOneBy({ id });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    await this.matchRepo.delete(id);

    return match;
  }

  async findBySlug(slug_match: string) {
    const match = await this.matchRepo.findOne({ where: { slug_match } });
    if (!match) {
      throw new NotFoundException('Match not found');
    }
    return match;
  }
}
