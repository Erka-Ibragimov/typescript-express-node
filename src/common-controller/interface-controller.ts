import { NextFunction, Request, Response, Router } from "express";
import { IMiddleWare } from "./middleware.interface";

export class IBaseController {
  path: string;
  method: keyof Pick<Router, "post" | "get">;
  fn: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: IMiddleWare[]
}
