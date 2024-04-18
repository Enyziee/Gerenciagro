import * as jwt from 'jsonwebtoken';

export async function createJWT(email: string) {
	return jwt.sign({ email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
}

export async function validadeJWT(token: string) {
	jwt.verify(token, process.env.JWT_SECRET!);
}
