import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { UserService } from 'src/user/user.service';
import { Article } from './entities/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    private readonly userSrv: UserService,
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  async createArticle(
    createArticleDto: CreateArticleDto,
    req: any,
  ): Promise<Article> {
    const user = await this.userSrv.findById(req.user.id);
    const article = new Article();
    Object.assign(article, createArticleDto);
    article.author = user;
    return await this.articleRepo.save(article);
  }

  async findAll(): Promise<Article[]> {
    // TODO : I need to apply Pagination here
    return await this.articleRepo.find();
  }

  async profileContent(req: any): Promise<Article[]> {
    return await this.articleRepo.find({
      where: { author: { id: req.user.id } },
    });
  }

  async findOne(slug: string): Promise<Article> {
    return await this.articleRepo.findOneBy({ slug });
  }

  async update(
    req: any,
    slug: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    const user = await this.userSrv.findById(req.user.id);
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

  async remove(req: any, slug: string): Promise<DeleteResult> {
    const user = await this.userSrv.findById(req.user.id);
    if (!user) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    const article = await this.articleRepo.findOneBy({ slug });
    if (!article) {
      throw new HttpException('Article Not Found', HttpStatus.NOT_FOUND);
    }
    return await this.articleRepo.delete(article.id);
  }
}
