import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI, // Versioning based on URI (e.g., /v1/endpoint)
    defaultVersion: '1', // Set default version to v1
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('API with Versioning')
    .setDescription('The API with versioning')
    .setVersion('1.0')
    .addTag('listings')
    .addTag('bookings')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
