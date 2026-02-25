import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { Cart } from '../cart/entities/cart.entity';

@Module({
  controllers: [TicketController],
  providers: [TicketService],
  imports: [TypeOrmModule.forFeature([Ticket, Cart])],
})
export class TicketModule {}
