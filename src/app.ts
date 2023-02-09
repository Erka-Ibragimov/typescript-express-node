import express, { Express } from 'express';
import { Server } from 'http';
import { inject, injectable } from 'inversify';
import { BaseError } from './errors/error-exeption';
import { LoggerService } from './logger/logger-service';
import { UsersController } from './users/users.controller';
import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import { TYPES } from './types';
dotenv.config();
@injectable()
export class App {
	port: number;
	app: Express;
	server: Server;
	constructor(
		@inject(TYPES.LoggerService) private logger: LoggerService,
		@inject(TYPES.IUserConstroller) private usersController: UsersController,
		@inject(TYPES.IError) private errors: BaseError,
	) {
		this.port = +process.env.PORT! || 7000;
		this.app = express();
	}

	protected router() {
		this.app.use('/api', this.usersController.router);
	}

	public catchErr() {
		this.app.use(this.errors.catchErrors.bind(this.errors));
	}

	public parseJson() {
		this.app.use(json());
		this.app.use(cookieParser());
		this.app.use(cors());
	}

	public async init() {
		this.parseJson();
		this.router();
		this.catchErr();
		this.server = this.app.listen(this.port, () => {
			console.log(`Listening on port ${this.port}`);
		});
	}
}
