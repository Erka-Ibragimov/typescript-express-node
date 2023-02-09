import { injectable } from 'inversify';
import { createLogger, transports, format, Logger } from 'winston';
import 'reflect-metadata';
@injectable()
export class LoggerService {
	loggerData: Logger;
	dateNow: string[];
	constructor() {
		this.dateNow = new Date().toLocaleDateString('en-US').split('/');
		this.loggerData = createLogger({
			transports: [
				new transports.Console({
					format: format.combine(
						format.colorize(),
						format.printf((info) => {
							return `[${info.timestamp}] ${info.level}: ${info.message} ${JSON.stringify(
								info.metadata,
							)}`;
						}),
					),
				}),
				new transports.File({
					dirname: 'logs',
					filename: `${this.dateNow[0]}-${this.dateNow[1]}-${this.dateNow[2]}.log`,
					format: format.combine(
						format.printf(({ timestamp, level, message, metadata }) => {
							return `[${timestamp}] ${level}: ${message} ${JSON.stringify(metadata)}`;
						}),
					),
				}),
			],
			format: format.combine(
				format.metadata(),
				format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
			),
		});
	}
}
