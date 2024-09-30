import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
// import { InternalServerErrorException } from '@nestjs/common';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  image: string; //* in our case, image is not really an image .. this is just the url where we can load the image

  @Column({ unique: true })
  username: string;

  // @Exclude()
  @Column({ select: false }) //* it means that in our all requests, by default we're not selecting the password field
  password: string;

  //   @OneToMany(() => Comment, (comment) => comment.user)
  //   comments: Comment[];

  //   @OneToMany(() => Article, (article) => article.author)
  //   articles: Article[];

  //   @ManyToMany(() => Article)
  //   @JoinTable()
  //   favorites: Article[]; //? the 3rd table name will be ( Plural Noun of entityClassOne _ relationName _ Plural Noun of entityClassTwo )
  //   //* in our case the 3rd table will be users_favorites_articles

  @BeforeInsert()
  async correctInputs(): Promise<any> {
    try {
      this.email = this.email.toLowerCase().trim();
      this.username = this.username.toLowerCase().trim();
      this.password = this.password.trim();
      this.password = await bcrypt.hash(this.password, 10);
    } catch (e) {
      console.log(e);
      // (); // 500
    }
  }
}
