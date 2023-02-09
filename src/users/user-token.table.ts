import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserTokeData {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	access_token: string;

	@Column()
	refresh_token: string;

	@Column()
	user_id: number;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;
}
