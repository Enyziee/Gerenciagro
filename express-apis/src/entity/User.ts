import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Farm } from './Farm';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({
		type: 'char',
		length: 255,
	})
	email!: string;

	@Column('char')
	fullName!: string;

	@Column({
		type: 'char',
		length: 60,
	})
	password!: string;

	@CreateDateColumn()
	creationDate!: string;

	@OneToMany(() => Farm, (farm) => farm.user)
	farms!: Farm[];
}
