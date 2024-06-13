import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field } from './Field';

@Entity()
export class ClimateHistory {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@Column({
		type: 'timestamp with time zone',
	})
	timestamp!: Date;

	@Column({
		type: 'decimal'
	})
	precipitationSum!: number;
	
	@Column()
	fieldId!: string;

	@ManyToOne(() => Field, (field) => field.climateHistory)
	field!: Field;
}
