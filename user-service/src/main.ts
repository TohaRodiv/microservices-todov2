import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe());

	// Настройка CORS
	app.enableCors({
		origin: true, // Разрешаем запросы с любого источника. В продакшене лучше указать конкретный домен.
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
		allowedHeaders: '*',
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
