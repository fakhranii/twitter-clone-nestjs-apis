import { IsNumber, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/article/entities/article.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  body: string;

  @ManyToOne(
    () => User,
    (user) => user.comments,
    // , {
    //   cascade: true,
    //   eager: true,
    // }
  )
  commentCreator: User;

  @ManyToOne(
    () => Article,
    (article) => article.comments,
    //  {
    //   cascade: true,
    //   eager: true,
    // }
  )
  article: Article;
}
