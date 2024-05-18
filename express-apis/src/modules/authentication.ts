import * as jwt from 'jsonwebtoken';
import { User } from '../entity/User';

export async function createJWT(user: User) {
	return jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export async function validadeJWT(token: string) {
	return jwt.verify(token, process.env.JWT_SECRET!);
}
