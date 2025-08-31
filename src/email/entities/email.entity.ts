import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../../user/entities/user.entity';

@Entity('emails')
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'model_type', nullable: true })
  modelType: string;

  @Column({ name: 'model_id', nullable: true })
  modelId: number;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'subject' })
  subject: string;

  @Column({ name: 'body', type: 'text' })
  body: string;

  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'sent_at', type: 'bigint', nullable: true })
  sentAt: number;

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint' })
  updatedAt: number;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  @Exclude()
  user: User;

  @BeforeInsert()
  setCreatedAt() {
    const now = Date.now();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = Date.now();
  }
}
