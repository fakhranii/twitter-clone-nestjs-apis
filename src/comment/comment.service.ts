import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Article } from 'src/article/entities/article.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async createComment(
    userReq: any,
    slug: string,
    createCommentDto: CreateCommentDto,
  ): Promise<{ commentsCount: number; article: Article }> {
    const user = await this.userRepo.findOne({
      where: {
        id: userReq.id,
      },
    });
    const article = await this.articleRepo.findOne({
      where: {
        slug: slug,
      },
      relations: ['comments'],
    });
    console.log(user);
    console.log(article);
    const comment = new Comment();
    Object.assign(comment, createCommentDto);
    comment.commentCreator = user;
    comment.article = article;
    article.commentCount = article.comments.length + 1;

    await this.articleRepo.save(article);
    await this.commentRepo.save(comment);
    return { commentsCount: article.commentCount, article };
  }

  async editComment(
    userReq: any,
    slug: string,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<{ message: string; updatedComment: Comment }> {
    const user = await this.userRepo.findOneBy({ id: userReq.id });
    if (!user) {
      throw new HttpException(`User Not Found`, HttpStatus.NOT_FOUND);
    }
    const article = await this.articleRepo.findOne({
      where: {
        slug: slug,
      },
      relations: ['comments'],
    });
    if (!article) {
      throw new HttpException(`Article Not Found`, HttpStatus.NOT_FOUND);
    }

    const comment = await this.commentRepo.findOne({
      where: {
        id: commentId,
        // commentCreator: user,
        // article: article,
      },
      relations: ['commentCreator'],
    });

    if (!comment) {
      throw new HttpException(
        'Comment not found or you do not have permission to edit this comment',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    if (comment.commentCreator.id !== user.id) {
      throw new HttpException(
        'You do not have permission to edit this comment',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    Object.assign(comment, updateCommentDto);

    // Save the updated comment
    const updatedComment = await this.commentRepo.save(comment);

    return { message: 'Comment updated successfully', updatedComment };
  }

  async deleteComment(
    userReq: any,
    slug: string,
    commentId: number,
  ): Promise<{ message: string }> {
    // Find the user
    const user = await this.userRepo.findOneBy({ id: userReq.id });
    if (!user) {
      throw new HttpException(`User Not Found`, HttpStatus.NOT_FOUND);
    }

    const article = await this.articleRepo.findOne({
      where: {
        slug: slug,
      },
      relations: ['comments'],
    });
    if (!article) {
      throw new HttpException(`Article Not Found`, HttpStatus.NOT_FOUND);
    }

    const comment = await this.commentRepo.findOne({
      where: {
        id: commentId,
        // commentCreator: user,
        // article: article,
      },
      relations: ['commentCreator'],
    });

    if (!comment) {
      throw new HttpException(
        'Comment not found or you do not have permission to delete this comment',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    if (comment.commentCreator.id !== user.id) {
      throw new HttpException(
        'You do not have permission to edit this comment',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    await this.commentRepo.remove(comment);

    return { message: 'Comment deleted successfully' };
  }
}
