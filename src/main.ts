import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable Cross-Origin Resource Sharing
  app.enableCors();

  // Add the global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have decorators
      forbidNonWhitelisted: true, // Throw an error if non-decorated properties are present
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );

  await app.listen(5050);
  console.log(`Application is running on: http://localhost:5050`);
}
bootstrap();
