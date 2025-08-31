import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('vehicle_details')
export class VehicleDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'vrm', unique: true })
  vrm: string;

  @Column({ name: 'basic_data', nullable: true, type: 'json' })
  basicData: Record<string, any>;

  @Column({ name: 'detailed_data', nullable: true, type: 'json' })
  detailedData: Record<string, any>;

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
