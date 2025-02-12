import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { TokenDto } from './dto/token.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';

@Injectable()
export class AuthService {
	constructor(
		private jwtService: JwtService,
		private userService: UserService,
	) { }

	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.userService.findByEmail(email);

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const isPasswordValid = await this.verifyPassword(password, user.password);
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		return this.sanitizeUser(user);
	}

	async login(user: any): Promise<TokenDto> {
		const payload = this.createTokenPayload(user);
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async validateToken(token: string): Promise<ValidateTokenDto> {
		try {
			const payload = this.jwtService.verify(token);
			console.log(payload)
			return { isValid: true, userId: payload.sub };
		} catch (error) {
			return { isValid: false };
		}
	}

	private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
		if (typeof plainTextPassword !== 'string' || typeof hashedPassword !== 'string') {
			throw new Error('Invalid input types for password comparison');
		}
		
		return bcrypt.compare(plainTextPassword, hashedPassword);
	}

	private sanitizeUser(user: any): any {
		const { password, ...result } = user;
		return result;
	}

	private createTokenPayload(user: any): any {
		return { email: user.email, sub: user.id };
	}
}