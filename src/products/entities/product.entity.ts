import { UserEntity } from 'src/users/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false, type: 'varchar'})
  name: string;

  @Column({nullable: false, type: 'varchar'})
  description: string;

  @Column('decimal')
  price: number;

  @Column({ type: 'bool', default: false })
  isApproved: boolean;

  @Column({ nullable: false, type: 'varchar' })
  user_id: string

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'user_id',
    referencedColumnName: 'id',
  })
  user: UserEntity;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at!: Date;
}

