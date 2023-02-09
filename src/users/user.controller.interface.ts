import { NextFunction, Request, Response } from 'express';
export interface IUserConstroller {
	login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	registration: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	logout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	refresh: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
