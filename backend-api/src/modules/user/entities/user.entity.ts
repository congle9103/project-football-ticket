import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Ticket } from 'src/modules/ticket/entities/ticket.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn() // tự động tăng
  id: number;

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];

  @Column({ length: 100 })
  username: string;

  @Column()
  password: string;

  @Index('UQ_users_email_not_null', {
    unique: true,
    where: 'email IS NOT NULL',
  })
  @Column({ nullable: true })
  //   → NULL được phép nhiều
  // → Nhưng nếu có email → phải unique
  email?: string;

  @Index('UQ_users_phone_not_null', {
    unique: true,
    where: 'phone IS NOT NULL',
  })
  @Column({ nullable: true })
  //   → NULL được phép nhiều
  // → Nhưng nếu có phone → phải unique
  phone?: string;

  @Index('UQ_users_hashedRefreshToken_not_null', {
    unique: true,
    where: 'hashedRefreshToken IS NOT NULL',
  })
  @Column({ nullable: true })
  //   → NULL được phép nhiều
  // → Nhưng nếu có hashedRefreshToken → phải unique
  hashedRefreshToken?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
