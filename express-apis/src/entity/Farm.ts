import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Field } from './Field';

@Entity()
export class Farm {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({
		type: 'varchar',
		length: '256',
	})
	name!: string;

	@Column({
		type: 'varchar',
		length: 64,
	})
	address!: string;

	@ManyToOne(() => User, (user) => user.farms)
	user!: User;

	@OneToMany(() => Field, (field) => field.farm)
	field!: Field[];
}
