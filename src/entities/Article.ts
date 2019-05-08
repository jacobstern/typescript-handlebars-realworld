import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  Index,
  ManyToMany,
} from 'typeorm';
import { User } from './User';
import { IsNotEmpty } from 'class-validator';

@Entity()
@Index('article_tags_index', { synchronize: false }) // GIN index managed in migrations
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column()
  title: string;

  @IsNotEmpty()
  @Column()
  description: string;

  @IsNotEmpty()
  @Column()
  body: string;

  @IsNotEmpty({ each: true })
  @Column('text', { array: true })
  tagList: string[];

  @Column({ unique: true })
  slug: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(_type => User, user => user.articles, {
    eager: true,
    nullable: false,
  })
  author: User;

  @ManyToMany(_type => User, user => user.favorites)
  favoritedBy: Promise<User[]>;

  @Column({ default: 0 })
  favoritesCount: number;
}
