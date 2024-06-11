import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UUID } from 'crypto';
import { FastifyRequest } from 'fastify';

export interface UserAuthToken {
  username: string;
  userId: UUID;
}

export const AuthToken = createParamDecorator(
  (data, context: ExecutionContext): UserAuthToken | null => {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const token = request.headers.authorization;
    if (token && 'user' in request) {
      return request.user as UserAuthToken;
    }
    return null;
  },
);
