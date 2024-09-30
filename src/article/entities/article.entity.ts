// import { Comment } from 'src/comment/entities/comment.entity';
// import { User } from 'src/user/entities/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
//   ManyToOne,
//   OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'articles' })
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  body: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column('simple-array') // this means that inside we will provide some values as an array
  tagList: string[];

  @Column({ default: 0 })
  favoritesCount: number;

  //   @OneToMany(() => Comment, (comment) => comment.article)
  //   comments: Comment[];

  //   @ManyToOne(() => User, (user) => user.articles, { eager: true })
  //   //? eager : true -> this option means that we will always load automatically this relation (author for our article)
  //   author: User; // first argument is the field name, it's not always should be the same name of entity class

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
