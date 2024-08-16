import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './gateway.auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  console.log('Starting microservices...');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: configService.get<number>('TCP_PORT'),
    },
  });
  await app.startAllMicroservices();
  console.log('Microservices started.');

  console.log('Starting HTTP server...');
  app.useGlobalGuards(new AuthGuard(configService));

  await app.listen(configService.get<number>('HTTP_PORT'));
  console.log('HTTP server started.');
}
bootstrap();
