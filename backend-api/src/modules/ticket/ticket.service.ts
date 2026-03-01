import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Cart } from '../cart/entities/cart.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepo: Repository<Ticket>,

    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    private readonly emailService: EmailService,
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
      price: cartItem.price,
      quantity: cartItem.quantity,
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

  async checkoutAll(userId: number, paymentMethod: string) {
    const cartItems = await this.cartRepo.find({
      where: { user: { id: userId } },
      relations: ['match', 'user'],
    });

    if (!cartItems.length) {
      throw new NotFoundException('Cart empty');
    }

    const tickets: Ticket[] = [];

    for (const item of cartItems) {
      const ticket = this.ticketRepo.create({
        match: item.match,
        user: item.user,
        area: item.area,
        price: item.price,
        quantity: item.quantity,
        paymentMethod,
      });

      await this.ticketRepo.save(ticket);
      tickets.push(ticket);
    }

    // Format thời gian (lấy match đầu tiên)
    const rawTime = cartItems[0].match.time;
    const formattedTime = new Date(rawTime.replace('--', 'T')).toLocaleString(
      'vi-VN',
      {
        dateStyle: 'full',
        timeStyle: 'short',
      },
    );

    const email = cartItems[0].user.email;

    if (!email) {
      throw new NotFoundException('User email not found');
    }

    // GỬI 1 EMAIL DUY NHẤT (lặp theo area)
    try {
      await this.emailService.sendCheckoutEmail(
        email,
        cartItems[0].match.name,
        formattedTime,
        cartItems,
      );
    } catch (err) {
      console.error('Send mail failed:', err);
    }

    // Xóa toàn bộ cart sau khi xử lý
    await this.cartRepo.delete({ user: { id: userId } });

    return tickets;
  }
}
