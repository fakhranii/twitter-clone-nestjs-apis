import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//* Inside this table, We'll store relation between different users.
@Entity('follows')
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followerId: number;

  @Column()
  followingId: number;
}
