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
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('api/v1/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post(':slug')
  createComment(
    @Request() req: any,
    @Param('slug') slug: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(req, slug, createCommentDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':slug/:commentId')
  async editComment(
    @Request() req: any,
    @Param('slug') slug: string,
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.editComment(
      req.user,
      slug,
      commentId,
      updateCommentDto,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':slug/:commentId')
  async deleteComment(
    @Request() req: any,
    @Param('slug') slug: string,
    @Param('commentId') commentId: number,
  ) {
    return this.commentService.deleteComment(req.user, slug, commentId);
  }
}
