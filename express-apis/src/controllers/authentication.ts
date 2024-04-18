import { Request, Response } from 'express';
import { UserRepository } from '../models/user';

import bcrypt from 'bcrypt';
import { createJWT } from '../modules/authentication';

export async function singin(req: Request, res: Response) {
	const { email, password } = req.body;

	if (!email || !password) {
		console.warn('Missing credentials');
		return res.status(400).json({ error: 'Missing Credentials' });
	}

	try {
		const user = await UserRepository.findByEmail(email);

		if (!user) {
			return res.status(401).json();
		}

		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) {
			return res.status(401).json('');
		}

		const token = await createJWT(user.email);

		return res.status(200).json({ token });
	} catch (error) {
		console.error('Something go wrong\n', error);
		return res.status(500).json({ error: 'Internal Error' });
	}
}
