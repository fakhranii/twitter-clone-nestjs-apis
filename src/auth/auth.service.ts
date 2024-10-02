import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SignInDTo } from './dto/signIn-auth.dto';
import { comparePasswords } from './bcrypt/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ user: User; token: string }> {
    const user = await this.userService.createUser(createUserDto);
    const payload = { id: user.id, username: user.username };
    delete user.password;
    return {
      user,
      token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(signInDTo: SignInDTo): Promise<{ user: User; token: string }> {
    const user = await this.userRepo.findOne({
      where: { username: signInDTo.username },
      select: ['id', 'password', 'username'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const matched = comparePasswords(signInDTo.password, user.password);
    if (!matched) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (matched) {
      const payload = { id: user.id, username: user.username };
      delete user.password;
      return {
        user,
        token: await this.jwtService.signAsync(payload),
      };
    }
  }
}
