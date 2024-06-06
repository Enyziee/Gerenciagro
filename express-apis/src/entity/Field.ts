import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Farm } from './Farm';
import { ClimateHistory } from './ClimateHistory';
import { DefensiveHistory } from './DefensiveHistory';

@Entity({ name: 'Fields' })
export class Field {
	@PrimaryGeneratedColumn('uuid')
	id!: string;

	@CreateDateColumn()
	createdAt!: number;

	@Column({
		type: 'varchar',
		length: 32,
	})
	name!: string;

	@Column({
		type: 'real',
	})
	size!: number;

	@Column()
	farmId!: string;

	@ManyToOne(() => Farm, (farm) => farm.fields)
	farm!: Farm;

	@OneToMany(() => ClimateHistory, (climateHistory) => climateHistory.field)
	climateHistory!: ClimateHistory[];

	@OneToMany(() => DefensiveHistory, (defensiveHistory) => defensiveHistory.field)
	defensiveHistory!: DefensiveHistory[];
}
