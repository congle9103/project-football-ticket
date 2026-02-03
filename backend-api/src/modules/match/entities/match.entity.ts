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

  @OneToMany(() => Ticket, (ticket) => ticket.match)
  tickets: Ticket[];

  @Column({ length: 100 })
  away_team: string;

  @Column({ length: 100 })
  image_away_team: string;

  @Column()
  time: string;

  @Column()
  stadium: string;

  @Column()
  round: string;

  @Column()
  season: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
