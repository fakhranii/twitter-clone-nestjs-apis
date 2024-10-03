import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Follow } from './entities/profile.entity';
import { Article } from 'src/article/entities/article.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Follow) private readonly followRepo: Repository<Follow>,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async getCurrentProfile(
    reqUser: any,
  ): Promise<{ articles: Article[]; articlesCount: number }> {
    const user = await this.userRepo.findOne({
      where: {
        id: reqUser.id,
      },
      relations: {
        articles: true,
      },
    });
    return { articlesCount: user.articles.length, articles: user.articles };
  }

  async followProfile(userReq: any, username: string) {
    const followerUser = await this.userRepo.findOne({
      where: { id: userReq.id },
    });

    if (!followerUser) {
      throw new HttpException('Follower user not found', HttpStatus.NOT_FOUND);
    }

    const followingUser = await this.userRepo.findOne({
      where: { username: username },
    });

    if (!followingUser) {
      throw new HttpException('User to follow not found', HttpStatus.NOT_FOUND);
    }

    const existingFollow = await this.followRepo.findOne({
      where: {
        followerId: followerUser.id,
        followingId: followingUser.id,
      },
    });

    if (existingFollow) {
      throw new HttpException(
        `You are already following ${username}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create a new Follow entity
    const follow = new Follow();
    follow.followerId = followerUser.id;
    follow.followingId = followingUser.id;

    // Save the follow relationship
    await this.followRepo.save(follow);

    return { message: `Followed ${username}` };
  }

  async unFollowProfile(userReq: any, username: string) {
    const followerUser = await this.userRepo.findOne({
      where: { id: userReq.id },
    });

    // Check if the follower exists
    if (!followerUser) {
      throw new HttpException('Follower user not found', HttpStatus.NOT_FOUND);
    }

    const followingUser = await this.userRepo.findOne({
      where: { username },
    });

    // Check if the user to unfollow exists
    if (!followingUser) {
      throw new HttpException(
        'User to unfollow not found',
        HttpStatus.NOT_FOUND,
      );
    }

    const following = await this.followRepo.findOne({
      where: { followingId: followingUser.id, followerId: followerUser.id },
    });

    // Check if the following relationship exists
    if (!following) {
      throw new HttpException(
        'You are not following this user',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.followRepo.remove(following);

    return { message: `Unfollowed ${username}` };
  }

  async newsFeed(
    userReq: any,
  ): Promise<{ articles: Article[]; articlesCount: number }> {
    const follows = await this.followRepo.find({
      where: { followerId: userReq.id },
    });

    if (follows.length === 0) {
      return { articles: [], articlesCount: 0 };
    }
    const followingUserIds = follows.map((follow) => follow.followingId); //* we return the id of the person who we followed
    const articles = await this.articleRepo.find({
      where: {
        author: {
          id: In(followingUserIds),
        },
      },
    });
    return { articlesCount: articles.length, articles };
  }

  async friendNewsFeed(
    userReq: any,
    username: string, // Use the friend's username instead of ID
  ): Promise<{ articles: Article[]; articlesCount: number }> {
    // Find the friend by their username
    const friend = await this.userRepo.findOne({
      where: { username: username },
    });

    if (!friend) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Fetch articles authored by the friend
    const articles = await this.articleRepo.find({
      where: {
        author: {
          id: friend.id, // Filter articles by the friend's ID
        },
      },
    });

    // Return articles and count
    return { articlesCount: articles.length, articles };
  }
}
