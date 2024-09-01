export class User {}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { USER_STATUS } from '../interfaces/users.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({nullable: false, type: 'varchar', unique: true })
  email: string;

  @Column({nullable: false, type: 'varchar'})
  password: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: false, type: 'varchar', default: USER_STATUS.ACTIVE })
  status: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at!: Date;
}