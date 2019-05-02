import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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
  articles?: Article[];

  public async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
