import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';
import { randomBytes } from 'node:crypto';

export async function createJWT(user: User) {
	return jwt.sign({ userid: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export async function validadeJWT(token: string) {
	return jwt.verify(token, process.env.JWT_SECRET!);
}

export async function createRefreshToken() {
	const token = randomBytes(16).toString('base64');
	const issuedAt = Date.now();
	const expiresIn = Date.now() + Date.now() + 86.400;
	
	return {token, issuedAt, expiresIn};
}
