import { ErrorHttp } from '../errors/error-http';
import { GenerateTokenResDto } from './dto-response/generate-token.res.dto';
import { UserTokeData } from './user-token.table';
import { UserData } from './user.table';

export interface IUserRepository {
	create: (email: string, password: string, name: string) => Promise<UserData | ErrorHttp>;
	find: (email: string, password: string) => Promise<UserData | ErrorHttp>;
	findUserById: (id: number) => Promise<UserData | null>;
	findByMail: (email: string) => Promise<UserData | null>;
	saveToken: (token: GenerateTokenResDto, id: number) => Promise<boolean>;
	removeToken: (refreshToken: string) => Promise<boolean>;
	findToken: (token: string) => Promise<UserTokeData | null>;
}
