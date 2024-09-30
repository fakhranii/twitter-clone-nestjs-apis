import { PartialType } from '@nestjs/mapped-types';
import { SignInDTo } from './signIn-auth.dto';

export class UpdateAuthDto extends PartialType(SignInDTo) {}
