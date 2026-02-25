import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Ticket } from 'src/modules/ticket/entities/ticket.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('matchs')
export class Match {
  @PrimaryGeneratedColumn() // tự động tăng
  id: number;

  @Column({ length: 100 })
  slug_match: string;

  @OneToMany(() => Ticket, (ticket) => ticket.match)
  tickets: Ticket[];

  @OneToMany(() => Cart, (cart) => cart.match)
  carts: Cart[];

  @Column({ length: 100 })
  away_team: string;

  @Column({ length: 100 })
  image_away_team: string;

  @Column()
  time: string;

  @Column()
  round: string;

  @Column()
  season: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
