import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
	constructor(
		private httpService: HttpService,
		private configService: ConfigService
	) { }

	async findByEmail(email: string): Promise<User | null> {
		try {
			const userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
			const interServiceSecret = this.configService.get<string>('INTER_SERVICE_SECRET');

			const response = await firstValueFrom(
				this.httpService.get<User>(`${userServiceUrl}/email/${email}`, {
					headers: {
						'Inter-Service-Auth': interServiceSecret
					}
				})
			);

			return response.data;
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 404) {
				return null;
			}
			console.error(error);
			throw error;
		}
	}
}