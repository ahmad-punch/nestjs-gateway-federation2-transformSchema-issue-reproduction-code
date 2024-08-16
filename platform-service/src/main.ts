import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Platform-Service');

  const app = await NestFactory.create(AppModule);
  await app.listen(3002, () => {
    logger.log(`Auth-Service is listening at port:${3002}...`);
  });
}
bootstrap();
