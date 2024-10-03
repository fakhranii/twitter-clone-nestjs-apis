import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('api/v1/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard)
  @Get(':my-profile')
  currentProfile(@Request() req) {
    return this.profileService.getCurrentProfile(req.user);
  }

  @UseGuards(AuthGuard)
  @Post(':username/follow')
  followProfile(@Request() req, @Param('username') username: string) {
    return this.profileService.followProfile(req.user, username);
  }

  @UseGuards(AuthGuard)
  @Delete(':username/un-follow')
  unfollowProfile(@Request() req, @Param('username') username: string) {
    return this.profileService.unFollowProfile(req.user, username);
  }

  @UseGuards(AuthGuard)
  @Get('news-feed')
  newsFeed(@Request() req) {
    return this.profileService.newsFeed(req.user);
  }

  @UseGuards(AuthGuard)
  @Get(':username/news-feed')
  friendNewsFeed(@Request() req, @Param('username') username: string) {
    return this.profileService.friendNewsFeed(req.user, username);
  }
}
