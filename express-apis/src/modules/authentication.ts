import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import { randomBytes } from 'node:crypto';

export async function createJWT(user: User) {
	return jwt.sign({ userid: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export async function validadeJWT(token: string) {
	return jwt.verify(token, process.env.JWT_SECRET!);
}

export function createRefreshToken() {
	const token = randomBytes(16).toString('hex');
	const issuedAt = Date.now();
	const expiresAt = Date.now() + Date.now() + 86400;

	return { token, issuedAt, expiresAt };
}
