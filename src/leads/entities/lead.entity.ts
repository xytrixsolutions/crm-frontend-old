import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { LeadSource } from './lead-source.entity';
import { LeadAction } from './lead-action.entity';

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'status' })
  status: string;

  @Column({ name: 'vrm', nullable: true })
  vrm: string;

  @Column({ name: 'vehicle_model', nullable: true })
  vehicleModel: string;

  @Column({ name: 'vehicle_year', nullable: true })
  vehicleYear: string;

  @Column({ name: 'vehicle_series', nullable: true })
  vehicleSeries: string;

  @Column({ name: 'vehicle_part', nullable: true })
  vehiclePart: string;

  @Column({ name: 'vehicle_brand', nullable: true })
  vehicleBrand: string;

  @Column({ name: 'vehicle_title', nullable: true })
  vehicleTitle: string;

  @Column({ name: 'part_supplied', nullable: true })
  partSupplied: string;

  @Column({ name: 'supply_only', nullable: true })
  supplyOnly: string;

  @Column({ name: 'consider_both', nullable: true })
  considerBoth: string;

  @Column({ name: 'reconditioned_condition', nullable: true })
  reconditionedCondition: string;

  @Column({ name: 'used_condition', nullable: true })
  usedCondition: string;

  @Column({ name: 'new_condition', nullable: true })
  newCondition: string;

  @Column({ name: 'consider_all_condition', nullable: true })
  considerAllCondition: string;

  @Column({ name: 'vehicle_drive', nullable: true })
  vehicleDrive: string;

  @Column({ name: 'collection_required', nullable: true })
  collectionRequired: string;

  @Column({ name: 'postcode' })
  postcode: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'number' })
  number: string;

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint' })
  updatedAt: number;

  @ManyToOne(() => LeadSource, { eager: true })
  @JoinColumn({ name: 'lead_source_id' })
  leadSource: LeadSource;

  @OneToMany(() => LeadAction, (leadAction) => leadAction.lead)
  leadActions: LeadAction[];

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
