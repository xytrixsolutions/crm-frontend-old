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

@Entity('terms_and_conditions')
export class TermsAndCondition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'sale_terms', type: 'text', nullable: true })
  saleTerms: string;

  @Column({ name: 'quotation_terms', type: 'text', nullable: true })
  quotationTerms: string;

  @Column({ name: 'warranty_terms', type: 'text', nullable: true })
  warrantyTerms: string;

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
