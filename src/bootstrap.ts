import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { AppDataSource } from './connect-db/settings.db';
import { BaseError } from './errors/error-exeption';
import { IError } from './errors/error.interface';
import { LoggerService } from './logger/logger-service';
import { TYPES } from './types';
import { IUserConstroller } from './users/user.controller.interface';
import { UserRepository } from './users/user.repository';
import { IUserRepository } from './users/user.repository.interface';
import { UserService } from './users/user.service';
import { IUserService } from './users/user.service.interface';
import { UsersController } from './users/users.controller';

export interface IBootstrapReturnType {
	appContainer: Container;
	app: App;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<App>(TYPES.Application).to(App);
	bind<LoggerService>(TYPES.LoggerService).to(LoggerService);
	bind<IUserConstroller>(TYPES.IUserConstroller).to(UsersController);
	bind<IUserService>(TYPES.UserService).to(UserService);
	bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
	bind<IError>(TYPES.IError).to(BaseError);
});

const bootstrap = (): IBootstrapReturnType => {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	AppDataSource.initialize()
		.then(() => console.log('Connected to db'))
		.catch((e) => console.log(e.message));

	return { appContainer, app };
};

export const { app, appContainer } = bootstrap();
