import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Lead } from '../../leads/entities/lead.entity';
import { SaleItem } from './sale-item.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ name: 'invoice_number' })
  invoiceNumber: number;

  @Column()
  warranty: string;

  @Column({ name: 'engine_type' })
  engineType: string;

  @Column({ nullable: true })
  milage: string;

  @Column({ name: 'sub_total', type: 'decimal', precision: 10, scale: 2 })
  subTotal: number;

  @Column({ name: 'vat_percent', type: 'decimal', precision: 10, scale: 2 })
  vatPercent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ name: 'created_at', type: 'bigint' })
  createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint' })
  updatedAt: number;

  @ManyToOne(() => Lead, { eager: true })
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => SaleItem, (saleItem) => saleItem.sale)
  saleItems: SaleItem[];

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
