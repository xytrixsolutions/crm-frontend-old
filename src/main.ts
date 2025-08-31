import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exceptions.filter';
import { SuccessInterceptor } from './common/interceptors/success.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);

  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
  });

  const reflector = app.get(Reflector);
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new SuccessInterceptor(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // auto-transforms payloads to DTO class instances
    }),
  );

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');

  const port = configService.get<number>('PORT', 3005);
  await app.listen(port);
  console.log(`This application is running on: ${await app.getUrl()}`);

  if (configService.get('NODE_ENV') === 'local') {
    const config = new DocumentBuilder()
      .setTitle('API Docs')
      .setDescription('NestJS API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    writeFileSync('./swagger.json', JSON.stringify(document));
    SwaggerModule.setup('api', app, document);
  }
}

void bootstrap();
