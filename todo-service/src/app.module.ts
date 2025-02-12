import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'postgres', // или 'postgres', если запускаете в Docker
			port: 5432,
			username: 'admin',
			password: 'todopassword',
			database: 'tododb',
			entities: [__dirname + '/**/*.entity{.ts,.js}'],
			synchronize: true, // Только для разработки!
		}),
		TodoModule,
	],
})
export class AppModule { }
