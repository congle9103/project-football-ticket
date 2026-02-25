import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Cart } from '../cart/entities/cart.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,

    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,
  ) {}

  // CREATE
  async create(dto: CreateTicketDto, userId: number) {
    const cartItem = await this.cartRepo.findOne({
      where: {
        id: dto.cartId,
        user: { id: userId }, // đảm bảo cart thuộc user này
      },
      relations: ['match', 'user'],
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const ticket = this.ticketRepo.create({
      match: cartItem.match,
      user: cartItem.user,
      area: cartItem.area,
      price: cartItem.price, // lấy từ DB
      quantity: cartItem.quantity, // lấy từ DB
      paymentMethod: dto.paymentMethod,
    });

    await this.ticketRepo.save(ticket);

    // Sau khi tạo ticket thì xóa cart item đó
    await this.cartRepo.delete(cartItem.id);

    return ticket;
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
