import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UserService } from 'src/user/user.service';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    private readonly userSrv: UserService,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async createArticle(
    createArticleDto: CreateArticleDto,
    userReq: any,
  ): Promise<Article> {
    const user = await this.userSrv.findById(userReq.id);
    const article = new Article();
    Object.assign(article, createArticleDto);
    article.author = user;
    return await this.articleRepo.save(article);
  }

  async findAll(): Promise<Article[]> {
    // TODO : I need to apply Pagination here
    return await this.articleRepo.find();
  }

  async profileContent(userReq: any): Promise<Article[]> {
    return await this.articleRepo.find({
      where: { author: { id: userReq.id } },
    });
  }

  async findOne(slug: string): Promise<Article> {
    return await this.articleRepo.findOneBy({ slug });
  }

  async update(
    userReq: any,
    slug: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const user = await this.userSrv.findById(userReq.id);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    const article = await this.articleRepo.findOneBy({ slug });
    if (!article) {
      throw new HttpException('Article Not Found', HttpStatus.NOT_FOUND);
    }
    Object.assign(article, updateArticleDto);
    return await this.articleRepo.save(article);
  }

  async remove(userReq: any, slug: string): Promise<DeleteResult> {
    const user = await this.userSrv.findById(userReq.id);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    const article = await this.articleRepo.findOneBy({ slug });
    if (!article) {
      throw new HttpException('Article Not Found', HttpStatus.NOT_FOUND);
    }
    return this.articleRepo.delete(article.id);
  }

  async addArticleToFavorites(userReq: any, slug: string): Promise<Article> {
    const user = await this.userSrv.findById(userReq.id);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    const article = await this.articleRepo.findOneBy({ slug });
    if (!article) {
      throw new HttpException('Article Not Found', HttpStatus.NOT_FOUND);
    }
    user.favorites.push(article);
    article.favoritesCount++;
    await this.userRepo.save(user);
    return this.articleRepo.save(article);
  }

  async removeArticleFromFavorites(
    userReq: any,
    slug: string,
  ): Promise<Article> {
    const user = await this.userSrv.findById(userReq.id);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    const article = await this.articleRepo.findOneBy({ slug });
    if (!article) {
      throw new HttpException('Article Not Found', HttpStatus.NOT_FOUND);
    }
    user.favorites = user.favorites.filter((fav) => fav.id !== article.id);
    article.favoritesCount--;
    await this.userRepo.save(user);
    return this.articleRepo.save(article);
  }
}
