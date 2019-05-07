import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from './User';
import { IsNotEmpty } from 'class-validator';

@Entity({ name: 'article' })
@Index('article_tags_index', { synchronize: false }) // GIN index managed in migrations
export class ArticleEntity {
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
  @Column('text', { array: true, name: 'tags' })
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
}
