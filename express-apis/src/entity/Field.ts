import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Farm } from './Farm';

@Entity()
export class Field {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({
		type: 'varchar',
		length: 32,
	})
	name!: string;

	@Column({
		type: 'real',
	})
	size!: number;

	@ManyToOne(() => Farm, (farm) => farm.field)
	farm!: Farm;
}
