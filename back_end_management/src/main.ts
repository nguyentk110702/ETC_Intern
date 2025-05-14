import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import * as passport from 'passport';
import { join } from 'path';
import * as Redis from 'redis';
import * as connectRedis from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);

  // Redis client cho version 3
  const redisClient = Redis.createClient({
    host: '127.0.0.1',
    port: 6379,
  });

  redisClient.on('error', (err) => console.log('Redis error: ', err));

  // Kết nối Redis với express-session
  const RedisStore = connectRedis(session);

  app.use(
    session({
      store: new RedisStore({
        client: redisClient,
        prefix: '',
      }),
      secret: 'mySecretKey',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 ngày
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const uploadsPath = join(process.cwd(), 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(3000);
  console.log(`🚀 Server running at http://localhost:3000`);
}

bootstrap();
