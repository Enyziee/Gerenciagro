import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Farm } from './Farm';
import { RefreshToken } from './refreshToken';

@Entity({ name: 'Users' })
export class User {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({
		type: 'varchar',
		length: 256,
	})
	email!: string;

	@Column({
		type: 'varchar',
		length: 128,
	})
	name!: string;

	@Column({
		type: 'varchar',
		length: 60,
	})
	password!: string;

	@Column({
		type: 'varchar',
		length: 64,
	})
	address!: string;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;

	@OneToMany(() => Farm, (farm) => farm.user, { cascade: true, onDelete: 'CASCADE'})
	farms!: Farm[];

	@OneToMany(() => RefreshToken, (token) => token.user)
	refreshTokens!: RefreshToken[];
}
