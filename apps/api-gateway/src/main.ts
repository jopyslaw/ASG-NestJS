import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalRpcExceptionFilter } from './filters/global-execption.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('api-gateway')
    .setDescription('Gateway API description')
    .setVersion('1.0')
    .addTag('gateway')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalFilters(new GlobalRpcExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
