import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
	@IsString()
	@MinLength(2)
	@MaxLength(20)
	readonly username: string;

	@IsEmail()
	readonly email: string;

	@IsString()
	@MinLength(6)
	readonly password: string;
}