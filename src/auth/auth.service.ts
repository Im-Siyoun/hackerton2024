import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './types/login.dto';
import { UserService } from '../user/user.service';
import {
  BadRequestException,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccessTokenPayload } from './types/access-token.payload';
import { User } from 'src/user/types/user.model';

export class AuthService {
  constructor(
    private readonly jwtservice: JwtService,
    @Inject(UserService)
    private readonly userservice: UserService,
  ) {}

  createAccessToken(data: AccessTokenPayload): string {
    const accessToken = this.jwtservice.sign(data);
    return accessToken;
  }

  async login(data: LoginDTO): Promise<string> {
    const user = await this.userservice.findOne(data.id);
    if (!user) {
      throw new NotFoundException({ message: '아이디가 틀립니다.' });
    }
    if (user.password != data.password) {
      throw new BadRequestException({ message: '비밀번호가 틀립니다.' });
    }

    const access_token = this.createAccessToken({ id: data.id });
    return access_token;
  }

  verifyToken(token: string): any {
    try {
      return this.jwtservice.verify(token);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async verifyUser(data: LoginDTO): Promise<User | null> {
    const user = await this.userservice.findOne(data.id);
    if (!user) {
      throw new BadRequestException('아이디가 틀립니다!');
    }
    if (user) {
      return user;
    }
  }
}
