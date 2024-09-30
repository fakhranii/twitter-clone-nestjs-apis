import { IsNumber, IsString } from 'class-validator';
// import { Article } from 'src/article/entities/article.entity';
// import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ nullable: true })
  text: string;

  @IsNumber()
  @Column({ default: 0 })
  commentCount: number;

  //   @ManyToOne(() => User, (user) => user.comments, {
  //     cascade: true,
  //     eager: true,
  //   })
  //   user: User;

  //   @ManyToOne(() => Article, (article) => article.comments, {
  //     cascade: true,
  //     eager: true,
  //   })
  //   article: Article;
}
