import { ErrorHttp } from '../errors/error-http';
import { GenerateTokenResDto } from './dto-response/generate-token.res.dto';
import { LogoutResponseDto } from './dto-response/logout.response.dto';
import { RefreshResponseDto } from './dto-response/refresh.response.dto';
import { IUserLoginResponse } from './dto-response/user.login.response.dto';
import { IUserRegResponse } from './dto-response/user.reg.response.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegDto } from './dto/user.reg.dto';

export interface IUserService {
	login: (body: UserLoginDto) => Promise<IUserLoginResponse>;
	reg: (body: UserRegDto) => Promise<IUserRegResponse>;
	logout: (refreshToken: string) => Promise<LogoutResponseDto>;
	refresh: (refreshToken: string) => Promise<RefreshResponseDto>;
	generateToken: (payload: object) => Promise<GenerateTokenResDto>;
}
