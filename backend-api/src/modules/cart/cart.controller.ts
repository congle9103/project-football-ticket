import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  create(@Body() createCart: CreateCartDto) {
    return this.cartService.create(createCart);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as any;
    return this.cartService.findUserCart(user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('clear')
  clear(@Req() req: Request) {
    const user = req.user as any;
    return this.cartService.clearUserCart(user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.cartService.updateQuantity(+id, quantity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
