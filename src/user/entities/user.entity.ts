import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ type: 'integer', unique: true, nullable: true })
  otp: number | null;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiresAt: Date | null;

  @Column({ nullable: false, default: false })
  isDeleted: boolean;

  @Column({ nullable: false, default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
