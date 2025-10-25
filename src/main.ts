import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import axios from 'axios';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('ICS Task Management API')
    .setDescription('API for managing tasks and users with JWT authentication')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(configService.get('PORT') ?? 3000);

  const url = `https://ics-task.onrender.com`;

  setInterval(
    () => {
      axios
        .get(url)
        .then((res) => {
          console.log('Self-ping:', res.data);
        })
        .catch((err: { message: string }) => {
          console.error('Self-ping failed:', err.message);
        });
    },
    14 * 60 * 1000,
  );
}
bootstrap().catch((error) =>
  console.error('Application failed to start', error),
);
