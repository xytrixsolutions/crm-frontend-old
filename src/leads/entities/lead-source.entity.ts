import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Lead } from './lead.entity';
import { Exclude } from 'class-transformer';

@Entity('lead_sources')
export class LeadSource {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'url', unique: true })
  url: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint' })
  updatedAt: number;

  @OneToMany(() => Lead, (lead: Lead) => lead.leadSource, { eager: false })
  @Exclude()
  leads: Lead[];

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
