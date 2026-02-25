import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { Cart } from './entities/cart.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../match/entities/match.entity';
import { User } from '../user/entities/user.entity';

@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [TypeOrmModule.forFeature([Cart, Match, User])],
})
export class CartModule {}
