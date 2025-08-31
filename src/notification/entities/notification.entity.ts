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

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column({ default: false })
  read: boolean;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
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
