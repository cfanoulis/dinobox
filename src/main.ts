import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import 'dotenv/config';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
void bootstrap();
