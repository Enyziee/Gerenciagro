import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Field } from './Field';

@Entity({ name: 'Farms' })
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

	@Column({
		nullable: true,
	})
	numberOfFields!: number;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;

	@Column()
	userId!: string;

	@ManyToOne(() => User, (user) => user.farms)
	user!: User;

	@OneToMany(() => Field, (field) => field.farm, { cascade: true })
	fields!: Field[];
}
