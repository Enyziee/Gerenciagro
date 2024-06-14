import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import { randomBytes } from 'node:crypto';
import DataSource from '../db/DataSource';
import { RefreshToken } from '../entity/refreshToken';
import { JWT_EXPIRATION, JWT_SECRET } from '../config';

export async function createJWT(user: User) {
	return jwt.sign({ userid: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

export async function validadeJWT(token: string) {
	return jwt.verify(token, JWT_SECRET!);
}

export async function decodeJWT(token: string) {
	return jwt.decode(token);
}

export function createRefreshToken(user: User) {
	const refreshTokenRepo = DataSource.getRepository(RefreshToken);

	const refreshTokenEntity = refreshTokenRepo.create();
	refreshTokenEntity.token = randomBytes(16).toString('hex');
	refreshTokenEntity.valid = true;
	refreshTokenEntity.issuedAt = new Date();
	refreshTokenEntity.expiresAt = new Date((Date.now() + (86400 * 1000)));
	refreshTokenEntity.user = user;

	console.log(new Date());
	console.log(new Date((Date.now() + (86400 * 1000))));
	
	refreshTokenRepo.save(refreshTokenEntity);
	return refreshTokenEntity;
}
