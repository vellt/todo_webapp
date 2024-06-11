import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = async (
  app: NestFastifyApplication,
  path = '/',
): Promise<void> => {
  const config = new DocumentBuilder()
    .setTitle('NotesAPI')
    .addBearerAuth({
      type: 'http',
      in: 'header',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const api = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(path, app, api);
};
