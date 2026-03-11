import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug'],
  });

  const port = process.env.PORT || 3000;

  await app.listen(3000, '0.0.0.0');

  const logger = new Logger('Bootstrap');
  logger.log(`✅ Server iniciado e escutando na porta ${port}`);
}
bootstrap();
