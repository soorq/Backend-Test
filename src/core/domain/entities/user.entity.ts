import { EToken } from './token.entity';
import { EPost } from './post.entity';
import { Role } from '@/shared/roles';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class EUser {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  declare id: string;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare first_name: string;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare last_name: string;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare img: string;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare age: string;

  @Column({
    type: 'varchar',
    array: false,
    nullable: true,
    length: 255,
    select: false,
  })
  declare password: string;

  @Column({
    type: 'enum',
    array: false,
    nullable: false,
    enum: Role,
    default: Role.USER,
  })
  declare role: Role;

  @Column({
    type: 'varchar',
    array: false,
    nullable: false,
    length: 255,
    unique: true,
  })
  declare email: string;

  @OneToMany(() => EPost, (post) => post.user, {
    nullable: true,
  })
  @JoinTable({
    name: 'user_posts',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
  })
  declare posts: EPost[];

  @OneToOne(() => EToken, (token) => token.user, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'token_id', referencedColumnName: 'id' })
  declare token: EToken;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
