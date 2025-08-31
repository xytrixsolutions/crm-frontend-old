import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'name', unique: true })
  name: string;

  @Column({ name: 'lead_limit' })
  leadLimit: number;

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint' })
  updatedAt: number;

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
