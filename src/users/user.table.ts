import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserData {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	name: string;

	@Column()
	password: string;
}
