import { DataSource } from 'typeorm';
import { UserTokeData } from '../users/user-token.table';
import { UserData } from '../users/user.table';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'postgres',
	password: 'root123',
	database: 'node-ts-express',
	synchronize: true,
	entities: [UserData, UserTokeData],
});
