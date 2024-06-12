import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Farm } from './Farm';
import { ClimateHistory } from './ClimateHistory';
import { DefensiveHistory } from './DefensiveHistory';

@Entity({ name: 'Fields' })
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

	@Column({
		nullable: true,
	})
	latitude!: string;
	
	@Column({
		nullable: true,
	})
	longitude!: string;
	
	@Column()
	farmId!: string;

	@CreateDateColumn()
	createdAt!: number;

	@UpdateDateColumn()
	updatedAt!: number;

	@ManyToOne(() => Farm, (farm) => farm.fields)
	farm!: Farm;

	@OneToMany(() => ClimateHistory, (climateHistory) => climateHistory.field)
	climateHistory!: ClimateHistory[];

	@OneToMany(() => DefensiveHistory, (defensiveHistory) => defensiveHistory.field)
	defensiveHistory!: DefensiveHistory[];
}
