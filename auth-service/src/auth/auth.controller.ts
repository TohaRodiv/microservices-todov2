import { Controller, Post, Body, UnauthorizedException, Get, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { ValidateTokenDto } from './dto/validate-token.dto';

@Controller('/')
export class AuthController {
	constructor(private authService: AuthService) { }

	@Post('login')
	async login(@Body() loginDto: LoginDto): Promise<TokenDto> {
		const user = await this.authService.validateUser(loginDto.email, loginDto.password);
		
		if (!user) {
			throw new UnauthorizedException();
		}

		return this.authService.login(user);
	}

	@Get('validate')
	async validateToken(@Headers('authorization') auth: string): Promise<ValidateTokenDto> {
		if (!auth || !auth.startsWith('Bearer ')) {
			return { isValid: false };
		}

		try {
			const token = auth.split(' ')[1];
			if (!token) {
				return { isValid: false };
			}
			return await this.authService.validateToken(token);
		} catch (error) {
			console.error('Error validating token:', error);
			return { isValid: false };
		}
	}
}