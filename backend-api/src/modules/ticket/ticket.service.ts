import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,
  ) {}

  // CREATE
  create(createTicketDto: CreateTicketDto) {
    const newTicket = this.ticketRepo.create(createTicketDto);
    return this.ticketRepo.save(newTicket);
  }

  // READ ALL
  findAll() {
    return this.ticketRepo.find({
      relations: ['match', 'user'],
    });
  }

  // READ ONE
  async findOne(id: number) {
    const ticket = await this.ticketRepo.findOne({
      where: { id },
      relations: ['match', 'user'],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  // UPDATE
  async update(id: number, updateTicketDto: UpdateTicketDto) {
    const existingTicket = await this.ticketRepo.findOneBy({ id });

    if (!existingTicket) {
      throw new NotFoundException('Ticket not found');
    }

    await this.ticketRepo.update(id, updateTicketDto);
    return this.ticketRepo.findOne({
      where: { id },
      relations: ['match', 'user'],
    });
  }

  // DELETE
  async remove(id: number) {
    const ticket = await this.ticketRepo.findOneBy({ id });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    await this.ticketRepo.delete(id);
    return ticket;
  }
}
