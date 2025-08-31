import { Exclude } from 'class-transformer';
import { Token } from '../../auth/entities/token.entity';
import { BusinessProfile } from '../../business-profile/entities/business-profile.entity';
import { Role } from '../../common/enums/role.enum';
import { LeadAction } from '../../leads/entities/lead-action.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column({ length: 50 })
  role: Role;

  @Column({ length: 50 })
  status: string;

  @Column({ type: 'bigint', name: 'created_at' })
  createdAt: number;

  @Column({ type: 'bigint', name: 'updated_at' })
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

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];
  @OneToMany(() => LeadAction, (leadAction) => leadAction.user)
  leadActions: LeadAction[];
  @OneToOne(() => BusinessProfile, (businessProfile) => businessProfile.user)
  businessProfile: BusinessProfile;
}
