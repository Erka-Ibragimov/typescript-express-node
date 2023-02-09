import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegDto } from './dto/user.reg.dto';
import { UserEntity } from './user.entity';
import { IUserService } from './user.service.interface';
import * as bcrypt from 'bcryptjs';
import { TYPES } from '../types';
import { IUserRepository } from './user.repository.interface';
import { ErrorHttp } from '../errors/error-http';
import { UserData } from './user.table';
import { LoggerService } from '../logger/logger-service';
import { IUserRegResponse } from './dto-response/user.reg.response.dto';
import { IUserLoginResponse } from './dto-response/user.login.response.dto';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { GenerateTokenResDto } from './dto-response/generate-token.res.dto';
import { LogoutResponseDto } from './dto-response/logout.response.dto';
import { RefreshResponseDto } from './dto-response/refresh.response.dto';
dotenv.config();
@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.UserRepository) private userRepository: IUserRepository,
		@inject(TYPES.LoggerService) private loggerService: LoggerService,
	) {}

	async reg(body: UserRegDto): Promise<IUserRegResponse> {
		try {
			const hashPass = await bcrypt.hash(body.password, 10);
			const newUser = new UserEntity(body.email, hashPass, body.name);
			const userToDb = (await this.userRepository.create(
				newUser.email,
				hashPass,
				newUser.name!,
			)) as UserData;
			return { email: userToDb.email, name: userToDb.name, id: userToDb.id };
		} catch (e: unknown) {
			if (e instanceof ErrorHttp) {
				this.loggerService.loggerData.error('UserService-Registration', { error: e.message });
				throw new ErrorHttp(e.statusCode, e.message);
			} else {
				this.loggerService.loggerData.error('', { error: 'Ошибка серверав' });
				throw new ErrorHttp(500, 'Ошибка серверав');
			}
		}
	}

	async login(body: UserLoginDto): Promise<IUserLoginResponse> {
		try {
			const user = new UserEntity(body.email, body.password);
			const checkEmail = (await this.userRepository.find(user.email, user.pass)) as UserData;
			const token = await this.generateToken({ email: checkEmail.email, name: checkEmail.name });
			await this.userRepository.saveToken(token, checkEmail.id);
			return {
				email: checkEmail.email,
				name: checkEmail.name,
				accessToken: token.accessToken,
				refreshToken: token.refreshToken,
			};
		} catch (e: unknown) {
			if (e instanceof ErrorHttp) {
				this.loggerService.loggerData.error('UserService-Login', { error: e.message });
				throw new ErrorHttp(e.statusCode, e.message);
			} else {
				console.log(e);
				this.loggerService.loggerData.error('', { error: 'Ошибка серверав' });
				throw new ErrorHttp(500, 'Ошибка сервера');
			}
		}
	}

	async logout(refreshToken: string): Promise<LogoutResponseDto> {
		try {
			const token = await this.userRepository.removeToken(refreshToken);
			return { message: token };
		} catch (e: unknown) {
			if (e instanceof ErrorHttp) {
				this.loggerService.loggerData.error('UserService-logout', { error: e.message });
				throw new ErrorHttp(e.statusCode, e.message);
			} else {
				this.loggerService.loggerData.error('', { error: 'Ошибка серверав' });
				throw new ErrorHttp(500, 'Ошибка сервера');
			}
		}
	}

	async refresh(refreshToken: string): Promise<RefreshResponseDto> {
		try {
			if (!refreshToken) {
				throw new ErrorHttp(401, 'Не авторизован');
			}
			const token = jwt.verify(refreshToken, process.env.SECRET_REFRESH!);
			const tokenFromDb = await this.userRepository.findToken(refreshToken);
			if (!token || !tokenFromDb) {
				throw new ErrorHttp(401, 'Не авторизованный пользователь');
			}
			const user = await this.userRepository.findUserById(tokenFromDb.user_id);
			if (!user) {
				throw new ErrorHttp(400, 'Пользователь не найден');
			}
			const newToken = await this.generateToken({ email: user.email, name: user.name });
			await this.userRepository.saveToken(newToken, tokenFromDb.user_id);
			return { ...newToken, id: user.id, email: user.email, name: user.name };
		} catch (e: unknown) {
			if (e instanceof ErrorHttp) {
				this.loggerService.loggerData.error('UserService-refresh', { error: e.message });
				throw new ErrorHttp(e.statusCode, e.message);
			} else {
				this.loggerService.loggerData.error('', { error: 'Ошибка серверав' });
				throw new ErrorHttp(500, 'Ошибка сервера');
			}
		}
	}

	async generateToken(payload: object): Promise<GenerateTokenResDto> {
		const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS!, { expiresIn: '30s' });
		const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH!, { expiresIn: '30d' });
		return {
			accessToken: accessToken,
			refreshToken: refreshToken,
		};
	}
}
