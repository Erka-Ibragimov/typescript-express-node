import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../common-controller/base-controller';
import { ErrorHttp } from '../errors/error-http';
import { LoggerService } from '../logger/logger-service';
import { TYPES } from '../types';
import { IUserConstroller } from './user.controller.interface';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegDto } from './dto/user.reg.dto';
import { PipeValidation } from '../validation/pipe-validation';
import { TokenValidation } from '../validation/token.validation';
import { IUserLoginResponse } from './dto-response/user.login.response.dto';
import 'reflect-metadata';

@injectable()
export class UsersController extends BaseController implements IUserConstroller {
	constructor(
		@inject(TYPES.LoggerService) private loggerData: LoggerService,
		@inject(TYPES.UserService) private userService: UserService,
	) {
		super(loggerData);

		this.bindController([
			{
				method: 'post',
				path: '/login',
				fn: this.login,
				middlewares: [new PipeValidation(UserLoginDto)],
			},
			{
				method: 'post',
				path: '/reg',
				fn: this.registration,
				middlewares: [new PipeValidation(UserRegDto)],
			},
			{
				method: 'get',
				path: '/getUser',
				fn: this.getUser,
				middlewares: [new TokenValidation()],
			},
			{
				method: 'post',
				path: '/logout',
				fn: this.logout,
				middlewares: [],
			},
			{
				method: 'get',
				path: '/refresh',
				fn: this.refresh,
				middlewares: [],
			},
		]);
	}

	async registration(
		{ body }: Request<{}, {}, UserRegDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			this.loggerData.loggerData.info('Registration Request', body);
			const result = await this.userService.reg(body);
			this.loggerData.loggerData.info('Registration Response', result);
			res.send(result);
		} catch (e: unknown) {
			if (e instanceof ErrorHttp) {
				res.status(e.statusCode).send({ error: e.message });
			} else {
				res.status(500).send({ error: 'Ошибка сервера' });
			}
		}
	}

	async login(
		{ body }: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			this.loggerData.loggerData.info('Login Request', body);
			const result = (await this.userService.login(body)) as IUserLoginResponse;
			res.cookie('refreshToken', result.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 100,
				httpOnly: true,
			});
			this.loggerData.loggerData.info('Login Response', result);
			res.send(result);
		} catch (e: unknown) {
			if (e instanceof ErrorHttp) {
				res.status(e.statusCode).send({ error: e.message });
			} else {
				res.status(500).send({ error: 'Ошибка сервера' });
			}
		}
	}

	async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshToken } = req.cookies;
			const token = await this.userService.logout(refreshToken);
			res.clearCookie('refreshToken');
			res.status(200).send(token);
		} catch (e: unknown) {
			if (e instanceof ErrorHttp) {
				res.status(e.statusCode).send({ error: e.message });
			} else {
				res.status(500).send({ error: 'Ошибка сервера' });
			}
		}
	}

	async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { refreshToken } = req.cookies;
			const userData = await this.userService.refresh(refreshToken);
			res.clearCookie('refreshToken');
			res.cookie('refreshToken', userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 100,
				httpOnly: true,
			});
			res.send(userData);
		} catch (e: unknown) {
			if (e instanceof ErrorHttp) {
				res.status(e.statusCode).send({ error: e.message });
			} else {
				res.status(500).send({ error: 'Ошибка сервера' });
			}
		}
	}

	async getUser(req: Request, res: Response, next: NextFunction) {
		try {
			res.send('Ok');
		} catch (e: unknown) {
			if (e instanceof ErrorHttp) {
				res.status(e.statusCode).send({ error: e.message });
			} else {
				res.status(500).send('Серверная ошибка');
			}
		}
	}
}
