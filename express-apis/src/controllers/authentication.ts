import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { User, UserRepository } from '../models/user';

import bcrypt from 'bcrypt';

export async function register(req: Request, res: Response) {
	const { name, email, password } = req.body;

	// TODO Adionar verificações extras para email;

	if (!name || !email || !password) {
		console.warn('Missing credentials');
		return res.status(400).json({ error: 'Missing Credentials' });
	}

	const userExists = await UserRepository.findByEmail(email);

	if (userExists) {
		console.warn('User already created');
		return res.status(409).json('User already created');
	}

	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User(crypto.randomUUID(), name, email, hashedPassword);

		await UserRepository.save(user);
		console.log('User created');
		return res.status(201).json('User created');
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal Error' });
	}
}

export async function login(req: Request, res: Response) {
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

		console.log('Info for token creation', email, process.env.JWT_TOKEN);

		const token = jwt.sign({ email }, process.env.JWT_TOKEN!, { expiresIn: '1h' });

		return res.status(200).json({ jwt: token });
	} catch (error) {
		console.error('Something go wrong\n', error);
		return res.status(500).json({ error: 'Internal Error' });
	}
}
