import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
console.log('MONGODB_URI', process.env.MONGODB_URI);
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				uri: 'mongodb://mongodb:27017/userdb',
			}),
			inject: [ConfigService],
		}),
		UserModule,
	],
})
export class AppModule { }
