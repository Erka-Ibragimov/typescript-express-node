import { NextFunction, Request, Response } from "express";
import { ErrorHttp } from "./error-http";

export interface IError {
  catchErrors: (
    error: Error | ErrorHttp,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void;
}
