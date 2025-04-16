import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as passport from 'passport';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // ✅ Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // ✅ Session & Passport
  app.use(
    session({
      secret: 'mySecretKey',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // true nếu chạy HTTPS
        httpOnly: true,
        sameSite: 'lax', // hoặc 'none' nếu dùng HTTPS khác domain
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // ✅ Serve ảnh từ thư mục uploads (cùng cấp với src)
  const uploadsPath = join(process.cwd(), 'uploads'); // 👈 dùng process.cwd() thay vì __dirname
  console.log('📁 Static files served from:', uploadsPath);
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // ✅ Listen
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);
  console.log(`🚀 Server running at http://localhost:${PORT}`);
}

bootstrap();
