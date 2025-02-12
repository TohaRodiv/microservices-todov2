import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

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
