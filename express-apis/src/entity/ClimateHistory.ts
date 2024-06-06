import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field } from './Field';

@Entity()
export class ClimateHistory {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	createdAt!: string;

	@Column()
	precipitationSum!: number;

	@ManyToOne(() => Field, (field) => field.climateHistory)
	field!: Field;
}
