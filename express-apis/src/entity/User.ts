import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Farm } from './Farm';

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
	createdAt!: number;

	@UpdateDateColumn()
	updatedAt!: number;

	@OneToMany(() => Farm, (farm) => farm.user)
	farms!: Farm[];
}
