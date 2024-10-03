// import { Comment } from 'src/comment/entities/comment.entity';
// import { User } from 'src/user/entities/user.entity';
import slugify from 'slugify';
import { User } from 'src/user/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
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

  @Column('simple-array', { nullable: true })
  tagList: string[] = [];

  @Column({ default: 0 })
  favoritesCount: number;

  //   @OneToMany(() => Comment, (comment) => comment.article)
  //   comments: Comment[];

  @ManyToOne(() => User, (user) => user.articles)
  author: User; // first argument is the field name, it's not always should be the same name of entity class

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @BeforeInsert()
  async getSlug(): Promise<any> {
    try {
      const randomString = Math.floor(Math.random() * 100000).toString();
      this.slug =
        slugify(this.title, {
          lower: true, // Convert to lowercase
          strict: true, // Remove special characters
        }) + randomString;
    } catch (e) {
      return 'there is an error with slugify';
    }
  }
}
