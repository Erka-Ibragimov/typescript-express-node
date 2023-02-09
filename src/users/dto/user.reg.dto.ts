import { IsEmail, IsString, Max, MaxLength } from 'class-validator';

export class UserRegDto {
	@IsEmail({}, { message: 'Некоректный email' })
	email: string;

	@IsString({ message: 'Не коректрный password' })
    @MaxLength(4,{message:"Запрещено больше 4 символов"})
	password: string;

	@IsString({ message: 'Не коректрый name' })
	name: string;
}
