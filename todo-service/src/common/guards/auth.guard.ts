import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private httpService: HttpService) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const { data } = await firstValueFrom(
				this.httpService.get(`http://auth-service:3000/validate`, {
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

		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers['authorization']?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}