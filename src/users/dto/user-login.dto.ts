import { IsEmail, IsString } from 'class-validator';

export class UserLoginDto {
	@IsEmail({}, { message: 'Пишите email' })
	email: string;

	@IsString({ message: 'Пишите в виде строки' })
	password: string;
}
