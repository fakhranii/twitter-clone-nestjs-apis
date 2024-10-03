import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Follow } from './entities/profile.entity';
import { Article } from 'src/article/entities/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Follow, Article])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
