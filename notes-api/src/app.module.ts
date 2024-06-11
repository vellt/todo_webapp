import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage, ServerResponse } from 'http';
import config from './app.configuration';
import { AuthModule } from './auth/auth.module';
import { NotesModule } from './notes/notes.module';

const isProd = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        name: 'NotesAPI',
        level: isProd ? 'info' : 'debug',
        serializers: {
          req: ({ method, url, params }) => ({ method, url, params }),
          res: ({ statusCode }) => ({ statusCode }),
          output: () => undefined,
        },
        transport: isProd ? undefined : { target: 'pino-pretty' },
        customLogLevel: (
          _req: IncomingMessage,
          res: ServerResponse<IncomingMessage>,
        ) => {
          if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
          } else if (res.statusCode >= 500) {
            return 'error';
          }
          return 'info';
        },
      },
    }),
    NotesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
