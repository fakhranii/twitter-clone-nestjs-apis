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

@Controller('api/v1/article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.createArticle(createArticleDto, req);
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  profileContent(@Request() req) {
    return this.articleService.profileContent(req);
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
    return this.articleService.update(req, slug, updateArticleDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':slug')
  remove(@Request() req, @Param('slug') slug: string) {
    return this.articleService.remove(req, slug);
  }
}
