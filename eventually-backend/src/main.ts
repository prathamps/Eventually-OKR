import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Eventually OKR API')
    .setDescription(
      'API for managing objectives and key results (OKRs), including progress tracking.',
    )
    .setVersion('1.0.0')
    .addTag('Health')
    .addTag('Objectives')
    .addTag('Key Results')
    .addTag('Chat Bot')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
