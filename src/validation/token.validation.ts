import { NextFunction, Request, Response } from 'express';
import { ErrorHttp } from '../errors/error-http';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { IMiddleWare } from '../common-controller/middleware.interface';
dotenv.config();

export class TokenValidation implements IMiddleWare {
	async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const authorizationHeader = req.header('Authorization');
			if (!authorizationHeader) {
				throw next(new ErrorHttp(401, 'Пользователь не авторизован'));
			}
			const token = authorizationHeader.split(' ')[1];
			if (!token) {
				throw next(new ErrorHttp(401, 'Не указан токен'));
			}
			jwt.verify(token, process.env.SECRET_ACCESS!, (err, data) => {
				if (err) {
					throw next(new ErrorHttp(401, 'Не верный токен'));
				} else if (data) {
					next();
				}
			});
			next();
		} catch (e: unknown) {
			if (e instanceof ErrorHttp) {
				throw next(new ErrorHttp(e.statusCode, e.message));
			}
			// else {
			// 	throw next(new ErrorHttp(500, 'Ошибка сервера'));
			// }
		}
	}
}
