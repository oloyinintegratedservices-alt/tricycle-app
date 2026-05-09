import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['https://tricycle-app-kappa.vercel.app'], // reflects request origin
    credentials: true, // IMPORTANT for cookies
  });

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
