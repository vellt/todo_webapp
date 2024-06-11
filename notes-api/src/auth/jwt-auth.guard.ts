import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private logger = new Logger(JwtAuthGuard.name);

  handleRequest(error, user, info) {
    if (error || !user) {
      this.logger.error({ message: info, error });
      throw new UnauthorizedException();
    }
    return user;
  }
}
