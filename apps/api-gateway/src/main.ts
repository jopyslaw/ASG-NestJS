import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalRpcExceptionFilter } from './filters/global-execption.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new GlobalRpcExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
