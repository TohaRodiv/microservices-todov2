import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InterServiceAuthMiddleware implements NestMiddleware {
	constructor(private configService: ConfigService) { }

	use(req: Request, res: Response, next: NextFunction) {
		const authHeader = req.headers['inter-service-auth'] as string;
		const secret = this.configService.get<string>('INTER_SERVICE_SECRET');

		if (authHeader !== secret) {
			throw new UnauthorizedException('Invalid inter-service authentication');
		}

		next();
	}
}