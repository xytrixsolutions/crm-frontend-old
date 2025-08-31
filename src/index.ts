/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Handler } from 'aws-lambda';
import { proxy } from 'aws-serverless-express';
import { createServer } from 'http';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let cachedServer;

async function bootstrapServer() {
  const app = await NestFactory.create(AppModule);
  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return createServer(expressApp);
}

export const handler: Handler = async (event, context) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return (
    proxy(cachedServer, event, context, 'PROMISE') as {
      promise: Promise<unknown>;
    }
  ).promise;
};
