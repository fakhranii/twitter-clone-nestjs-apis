import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Article } from './entities/article.entity';

@Controller('api/v1/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.createArticle(createArticleDto, req.user);
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.articleService.findOne(slug);
  }

  @UseGuards(AuthGuard)
  @Patch(':slug')
  update(
    @Request() req,
    @Param('slug') slug: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return this.articleService.update(req.user, slug, updateArticleDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':slug')
  remove(@Request() req, @Param('slug') slug: string) {
    return this.articleService.remove(req.user, slug);
  }

  @UseGuards(AuthGuard)
  @Post('/:slug/favorite')
  async addArticleToFavorites(
    @Request() req,
    @Param('slug') slug: string,
  ): Promise<Article> {
    return this.articleService.addArticleToFavorites(req.user, slug);
  }

  @UseGuards(AuthGuard)
  @Delete(':slug/favorite')
  async removeArticleFromFavorites(
    @Request() req,
    @Param('slug') slug: string,
  ): Promise<Article> {
    return this.articleService.removeArticleFromFavorites(req.user, slug);
  }
}
