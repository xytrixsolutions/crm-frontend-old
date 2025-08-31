import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Lead } from './lead.entity';
import { User } from '../../user/entities/user.entity';
import { Exclude } from 'class-transformer';

@Entity('lead_actions')
export class LeadAction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint' })
  updatedAt: number;

  @ManyToOne(() => Lead, { eager: false })
  @JoinColumn({ name: 'lead_id' })
  @Exclude()
  lead: Lead;

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
