import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { Match } from 'src/modules/match/entities/match.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepo: Repository<Cart>,

    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateCartDto) {
    const match = await this.matchRepo.findOne({
      where: { id: dto.match_id },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    const user = await this.userRepo.findOne({
      where: { id: dto.user_id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 🔥 CHECK xem đã có vé cùng khu chưa
    const existingCart = await this.cartRepo.findOne({
      where: {
        user: { id: dto.user_id },
        match: { id: dto.match_id },
        area: dto.area,
      },
    });

    // Nếu đã có → tăng quantity
    if (existingCart) {
      existingCart.quantity += 1;
      return this.cartRepo.save(existingCart);
    }

    // Nếu chưa có → tạo mới
    const newCart = this.cartRepo.create({
      area: dto.area,
      price: dto.price,
      quantity: 1,
      match,
      user,
    });

    return this.cartRepo.save(newCart);
  }

  findAll() {
    return this.cartRepo.find({
      relations: ['match', 'user'], // để trả về luôn thông tin liên kết
    });
  }

  async updateQuantity(id: number, quantity: number) {
    const cart = await this.cartRepo.findOneBy({ id });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.quantity = quantity;

    return this.cartRepo.save(cart);
  }

  async clearUserCart(userId: number) {
    return this.cartRepo.delete({
      user: { id: userId },
    });
  }

  async remove(id: number) {
    const cart = await this.cartRepo.findOneBy({ id });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartRepo.delete(id);

    return { message: 'Cart deleted' };
  }

  async findUserCart(userId: number) {
    return this.cartRepo.find({
      where: { user: { id: userId } },
      relations: ['match'],
    });
  }
}
