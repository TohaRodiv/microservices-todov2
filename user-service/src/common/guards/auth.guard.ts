import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private httpService: HttpService,
		private configService: ConfigService,
		private reflector: Reflector
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			console.error('No authorization token provided');
			throw new UnauthorizedException();
		}

		try {
			const authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
			const { data } = await firstValueFrom(
				this.httpService.get(`${authServiceUrl}/validate`, {
					headers: { Authorization: `Bearer ${token}` },
				})
			);
			if (data.isValid) {
				request['user'] = { userId: data.userId };
				return true;
			}

			throw new UnauthorizedException();
		} catch (error) {
			console.error('Exception authorized', error);
			throw new UnauthorizedException();
		}
	}

	private extractTokenFromHeader(request: any): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}