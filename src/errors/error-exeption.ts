import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import { LoggerService } from "../logger/logger-service";
import { ErrorHttp } from "./error-http";
import { IError } from "./error.interface";
import "reflect-metadata";
import { TYPES } from "../types";
@injectable()
export class BaseError implements IError {
  constructor(@inject(TYPES.LoggerService) private loggerService: LoggerService) {}

  catchErrors(
    error: Error | ErrorHttp,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ErrorHttp) {
      this.loggerService.loggerData.error(
        `[${error.context}] Ошибка ${error.statusCode} : ${error.message}`
      );
      res.status(error.statusCode).send({ error: error.message });
    } else {
      this.loggerService.loggerData.error(`${error.message}`);
      res.status(500).send({ error: error.message });
    }
  }
}
