import { Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

class RefreshToken {
	@PrimaryColumn()
	token!: string;

	@Column()
	valid!: boolean;

	@Column()
	issuedAt!: Date;

	@Column()
	expiresAtAt!: Date;
}
