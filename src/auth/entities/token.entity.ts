import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'access_token' })
  token: string;

  @Column({ name: 'expires_at', type: 'bigint' })
  expiresAt: number;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @Column({ name: 'refresh_token_expires_at', type: 'bigint' })
  refreshTokenExpiresAt: number;

  @Column({ name: 'ip_address' })
  ipAddress: string;

  @Column({ name: 'device_token', nullable: true })
  deviceToken: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  @Exclude()
  user: User;

  @Column({ type: 'bigint', name: 'created_at' })
  createdAt: number;

  @Column({ type: 'bigint', name: 'updated_at' })
  updatedAt: number;

  @BeforeInsert()
  setCreationTimestamp() {
    const now = Date.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  setUpdateTimestamp() {
    this.updatedAt = Date.now();
  }
}
