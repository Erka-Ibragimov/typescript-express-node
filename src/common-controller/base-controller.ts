import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { LoggerService } from '../logger/logger-service';
import { IBaseController } from './interface-controller';
import 'reflect-metadata';
import { TYPES } from '../types';
@injectable()
export class BaseController {
	protected readonly _router: Router;

	constructor(@inject(TYPES.LoggerService) private logger: LoggerService) {
		this._router = Router();
	}

	get router() {
		return this._router;
	}

	protected bindController(routes: IBaseController[]) {
		for (const route of routes) {
			const middleware = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.fn.bind(this);
			const pipeline = middleware ? [...middleware, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
