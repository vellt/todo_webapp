import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(username: string, pass: string): Promise<User> {
    const user = this.usersService.findOne(username);
    if (user && (await compare(pass, user.password))) {
      return {
        ...user,
        password: undefined,
      };
    }
    return null;
  }

  public login(user: User): Promise<string> {
    return this.jwtService.signAsync({
      username: user.email,
      sub: user.userId,
    });
  }
}
