import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  getManager,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { Article } from './Article';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'citext' })
  username: string;

  @Column({ unique: true, type: 'citext' })
  email: string;

  @Column()
  password: string;

  @Column('text', { nullable: true })
  bio?: string | null;

  @Column('text', { nullable: true })
  image?: string | null;

  @OneToMany(_type => Article, article => article.author)
  articles: Promise<Article[]>;

  @ManyToMany(_type => User, user => user.following)
  followers: Promise<User[]>;

  @ManyToMany(_type => User, user => user.followers)
  @JoinTable()
  following: Promise<User[]>;

  public async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
