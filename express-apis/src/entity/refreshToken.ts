import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'RefreshTokens' })
export class RefreshToken {
	@PrimaryColumn()
	token!: string;

	@Column()
	valid!: boolean;

	@Column()
	issuedAt!: Date;

	@Column()
	expiresAt!: Date;

	@ManyToOne(() => User, (user) => user.refreshTokens)
	user!: User;
}
