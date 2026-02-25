import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clubs')
export class Club {
  @PrimaryGeneratedColumn() // tự động tăng
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  logo: string;

  @Column({ length: 100 })
  stadium: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
