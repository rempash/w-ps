import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Listen to mongoose connection events
  mongoose.connection.on('connected', () => {
    logger.log('✅ MongoDB successfully connected!');
  });
  
  mongoose.connection.on('error', (err) => {
    logger.error(`❌ MongoDB connection error: ${err.message}`);
  });

  const app = await NestFactory.create(AppModule);
  // Optional: Global prefix, validation pipes, etc.
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port);
  
  logger.log(`🚀 Application is listening on port: ${port}`);
}
bootstrap();
