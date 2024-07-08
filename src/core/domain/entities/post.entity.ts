import { ECategory } from './category.entity';
import { EUser } from './user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('post')
export class EPost {
  @PrimaryGeneratedColumn({ name: 'post_id' })
  id: string;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare title: string;

  @Column({ type: 'varchar', array: false, nullable: false, length: 255 })
  declare desc: string;

  @Column({ type: 'varchar', array: false, nullable: false, unique: true })
  declare link: string;

  @Column({ type: 'varchar', array: false, nullable: false })
  declare city: string;

  @ManyToOne(() => EUser, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  declare user: EUser;

  @ManyToMany(() => ECategory, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
    nullable: true,
    cascade: true,
  })
  @JoinTable({
    name: 'posts_category',
    joinColumn: {
      name: 'post_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  declare category: ECategory[];

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
