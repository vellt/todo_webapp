import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { Configuration } from './app.configuration';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );
  const config: ConfigService<Configuration> = app.get(ConfigService);

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      enableDebugMessages: true,
    }),
  );
  app.enableShutdownHooks();

  app.enableCors({
    credentials: true,
    preflightContinue: true,
  });

  process.on('uncaughtException', (error, source) => {
    logger.error({
      message: `Uncaught exception: ${error?.message}`,
      stack: error?.stack,
      source,
    });
  });

  await setupSwagger(app, 'api-doc');

  await app.listen(
    config.get('API_PORT'),
    config.get('API_HOST'),
    (error, address) => {
      if (error) {
        logger.error(error);
        return;
      }
      logger.debug(
        `Application started in ${process.env.NODE_ENV} environment`,
      );
      logger.debug(`Service layer is listening on ${address}`);
    },
  );
}
bootstrap();
