import bcrypt from 'bcrypt';
import DataSource from '../db/DataSource';

import { Request, Response } from 'express';

import { createJWT } from '../modules/authentication';
import { User } from '../entity/User';

const userRepository = DataSource.getRepository(User);

export async function login(req: Request, res: Response) {
	const { email, password } = req.body;

	if (!email || !password) {
		console.warn('Missing credentials');
		return res.status(400).json({ error: 'Missing Credentials' });
	}

	try {
		const user = await userRepository.findOneBy({
			email: email,
		});

		if (!user) {
			return res.status(401).json();
		}

		const validPassword = await bcrypt.compare(password, user.password);

		if (!validPassword) {
			return res.status(401).json({ error: 'Invalid Credentials' });
		}

		const token = await createJWT(user);

		return res.status(200).json({ access_token: token });
	} catch (error) {
		console.error('Something go wrong\n', error);
		return res.status(500).json({ error: 'Internal Error' });
	}
}

export async function register(req: Request, res: Response) {
	const { name, email, password, address } = req.body;

	// TODO Adionar verificações extras para email;

	if (!name || !email || !password || !address) {
		console.log(`$Name: {name}, Email: ${email}, Password: ${password}, Address: ${address}`);
		console.warn('Missing credentials');
		return res.status(400).json({ error: 'Missing Credentials' });
	}

	const userExists = await userRepository.findOneBy({
		email: email,
	});

	if (userExists) {
		console.warn('User already created');
		return res.status(409).json({ message: 'User already exists' });
	}

	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User();
		user.name = name;
		user.email = email;
		user.address = address;
		user.password = hashedPassword;

		await userRepository.save(user);
		return res.status(201).json({ message: 'User created' });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal Error' });
	}
}
