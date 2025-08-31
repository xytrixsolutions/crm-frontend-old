import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
  OneToOne,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Exclude } from 'class-transformer';
import { TermsAndCondition } from '../../terms-and-conditions/entities/terms-and-condition.entity';
import { BankDetail } from '../../bank-details/entities/bank-detail.entity';

@Entity('business_profiles')
export class BusinessProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'business_name' })
  @Index()
  businessName: string;

  @Column({ name: 'primary_phone', unique: true })
  primaryPhone: string;

  @Column({ name: 'alternate_phone', nullable: true })
  alternatePhone: string;

  @Column({ name: 'default_warranty', nullable: true })
  defaultWarranty: string;

  @Column({ name: 'vat_number', nullable: true })
  vatNumber: string;

  @Column({ name: 'business_type', nullable: true })
  businessType: string;

  @Column({ name: 'street_address' })
  streetAddress: string;

  @Column({ name: 'city' })
  city: string;

  @Column({ name: 'post_code' })
  postCode: string;

  @Column({ name: 'country' })
  country: string;

  @Column({ name: 'quoting_person_name' })
  quotingPersonName: string;

  @Column({ name: 'logo', nullable: true })
  logo: string;

  @Column({ name: 'vat_enabled', default: false })
  vatEnabled: boolean;

  @Column({ default: false })
  completed: boolean;

  @OneToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  @Exclude()
  user: User;

  @OneToOne(
    () => TermsAndCondition,
    (termsAndConditions) => termsAndConditions.businessProfile,
  )
  termsAndConditions: TermsAndCondition;

  @OneToOne(() => BankDetail, (bankDetails) => bankDetails.businessProfile)
  bankDetails: BankDetail;

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
