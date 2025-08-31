import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BusinessProfile } from '../../business-profile/entities/business-profile.entity';

@Entity('bank_details')
export class BankDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'account_number' })
  accountNumber: string;

  @Column({ name: 'sort_code' })
  sortCode: string;

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint' })
  updatedAt: number;

  @OneToOne(() => BusinessProfile, { eager: false })
  @JoinColumn({ name: 'business_profile_id' })
  businessProfile: BusinessProfile;

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
