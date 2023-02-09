import { injectable } from 'inversify';
import 'reflect-metadata';
import { AppDataSource } from '../connect-db/settings.db';
import { ErrorHttp } from '../errors/error-http';
import { IUserRepository } from './user.repository.interface';
import { UserData } from './user.table';
import * as bcrypt from 'bcryptjs';
import { UserTokeData } from './user-token.table';
import { GenerateTokenResDto } from './dto-response/generate-token.res.dto';

@injectable()
export class UserRepository implements IUserRepository {
	constructor() {}

	async create(email: string, password: string, name: string): Promise<UserData | ErrorHttp> {
		const condidate = await this.findByMail(email);
		if (condidate) {
			throw new ErrorHttp(400, `Пользователь с таким ${email} уже существует`);
		}
		const newUser = new UserData();
		newUser.email = email;
		newUser.password = password;
		newUser.name = name;
		await AppDataSource.manager.save(newUser);
		return newUser;
	}

	async find(email: string, password: string): Promise<UserData | ErrorHttp> {
		const condidate = await this.findByMail(email);
		if (!condidate) {
			throw new ErrorHttp(401, `Пользователь с таким ${email} не сущевствует`);
		}
		const checkPass = await bcrypt.compare(password, condidate.password);
		if (!checkPass) {
			throw new ErrorHttp(401, 'Неверный пароль');
		}
		return condidate;
	}

	async findByMail(email: string): Promise<UserData | null> {
		const userDataRepository = AppDataSource.getRepository(UserData);
		return await userDataRepository.findOneBy({
			email: email,
		});
	}

	async findUserById(id: number): Promise<UserData | null> {
		const userDataRepository = AppDataSource.getRepository(UserData);
		const condidate = await userDataRepository.findOneBy({
			id: id,
		});
		return condidate;
	}

	async saveToken(token: GenerateTokenResDto, id: number): Promise<boolean> {
		const tokenRepository = AppDataSource.getRepository(UserTokeData);
		const condidate = await tokenRepository.findOneBy({
			user_id: id,
		});
		if (condidate) {
			condidate.access_token = token.accessToken;
			condidate.refresh_token = token.refreshToken;
			await AppDataSource.manager.save(condidate);
			return true;
		} else {
			const userTokenData = new UserTokeData();
			userTokenData.access_token = token.accessToken;
			userTokenData.refresh_token = token.refreshToken;
			userTokenData.user_id = id;
			await AppDataSource.manager.save(userTokenData);
			return true;
		}
	}

	async removeToken(refresh: string): Promise<boolean> {
		const tokenRepository = AppDataSource.getRepository(UserTokeData);
		const condidate = await tokenRepository.findOneBy({
			refresh_token: refresh,
		});
		if (!condidate) {
			throw new ErrorHttp(401, 'Не найден token');
		}
		await tokenRepository.remove(condidate);
		return true;
	}

	async findToken(token: string): Promise<UserTokeData | null> {
		const tokenRepository = AppDataSource.getRepository(UserTokeData);
		const condidate = await tokenRepository.findOneBy({
			refresh_token: token,
		});
		return condidate;
	}
}
