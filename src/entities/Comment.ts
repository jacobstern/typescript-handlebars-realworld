import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Article } from './Article';
import { MinLength } from 'class-validator';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @MinLength(15, { message: 'comment must be at least 15 characters long' })
  @Column()
  body: string;

  @ManyToOne(_type => User, user => user.comments, {
    eager: true,
    nullable: false,
  })
  author: User;

  @ManyToOne(_type => Article, article => article.comments, {
    nullable: false,
  })
  article: Article;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
