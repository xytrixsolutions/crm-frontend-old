import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Package } from './package.entity';
import { BusinessProfile } from 'src/business-profile/entities/business-profile.entity';

@Entity('business_packages')
export class BusinessPackage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'lead_used' })
  leadUsed: number;

  @Column({ name: 'expires_at', type: 'bigint', nullable: true })
  expiresAt: number;

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint' })
  updatedAt: number;

  @ManyToOne(() => Package, { eager: true })
  @JoinColumn({ name: 'package_id' })
  package: Package;

  @ManyToOne(() => BusinessProfile, { eager: false })
  @JoinColumn({ name: 'business_id' })
  business: BusinessProfile;

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
