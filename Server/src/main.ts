import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 设置全局前缀为 'api'
  app.setGlobalPrefix('api');
  // 启用 CORS
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
