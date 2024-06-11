import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { LoginRequest, validateLoginRequest } from '../users/user.type';
import { ValidationError } from 'class-validator';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const { username, password } = request.body as LoginRequest;
    try {
      await validateLoginRequest(username, password);
    } catch (error) {
      throw new BadRequestException({
        message: (error as ValidationError[]).map((error) => error.constraints),
      });
    }
    return super.canActivate(context) as Promise<boolean>;
  }
}
