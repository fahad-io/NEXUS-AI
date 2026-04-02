import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  app.use(cookieParser());
  app.useStaticAssets(join(process.cwd(), 'uploads'), { prefix: '/uploads/' });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('Interactive API documentation for the Nest backend')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Paste a JWT access token to call protected endpoints',
      },
      'bearer',
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    customSiteTitle: 'Backend API',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = Number(process.env.PORT || 8080);
  try {
    await app.listen(port);
  } catch (error: unknown) {
    const listenError = error as NodeJS.ErrnoException;
    if (listenError.code === 'EADDRINUSE') {
      console.error(
        `Port ${port} is already in use. Stop the existing process or change PORT in backend/.env.`,
      );
      console.error(
        `On Windows, you can inspect it with: Get-NetTCPConnection -LocalPort ${port} -State Listen`,
      );
    }
    throw error;
  }

  const url = await app.getUrl();
  console.log(`Backend running on port ${port}`);
  console.log(`Backend URL: ${url}`);
  console.log(`Swagger docs available at ${url}/api/docs`);
}
bootstrap();
