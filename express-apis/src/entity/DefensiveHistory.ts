import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field } from './Field';

@Entity()
export class DefensiveHistory {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	createdAt!: Date;

	@Column()
	agrodefensive!: string;
	
	@Column({
		type: 'numeric'
	})
	volume!: number;

	@ManyToOne(() => Field, (field) => field.defensiveHistory)
	field!: Field;
}
