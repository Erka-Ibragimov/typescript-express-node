import { ClassConstructor, plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { IMiddleWare } from '../common-controller/middleware.interface';

export class PipeValidation implements IMiddleWare {
	constructor(private classToValidate: ClassConstructor<object>) {}
	async execute({ body }: Request, res: Response, next: NextFunction): Promise<void> {
		const instanse = plainToClass(this.classToValidate, body);
		await validate(instanse).then((errors) => {
			let errorObj:any = {};
			if (errors.length > 0) {
				errors.forEach((value) => {
					errorObj[value.property] = value.constraints;
				});
				res.status(422).send(errorObj);
			} else {
				next();
			}
		});
	}
}
