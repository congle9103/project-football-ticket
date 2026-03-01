import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('staffs')
export class Staff {
  @PrimaryGeneratedColumn() // tự động tăng
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Index('UQ_staffs_hashedRefreshToken_not_null', {
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
