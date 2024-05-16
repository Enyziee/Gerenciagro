import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import DataSource from '../db/DataSource';
import { User } from '../entity/User';

const userRepository = DataSource.getRepository(User);

export async function createUser(req: Request, res: Response) {
	const { name, email, password } = req.body;

	// TODO Adionar verificações extras para email;

	if (!name || !email || !password) {
		console.warn('Missing credentials');
		return res.status(400).json({ error: 'Missing Credentials' });
	}

	const userExists = await userRepository.findOneBy({
		email: email,
	});

	if (userExists) {
		console.warn('User already created');
		return res.status(409).json('User already created');
	}

	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = new User();
		user.name = name;
		user.email = email;
		user.password = hashedPassword;

		await userRepository.save(user);
		return res.status(201).json();
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal Error' });
	}
}

export async function getUserInfo(req: Request, res: Response) {
	res.send(200).json({ content: res.locals.user });
}

export async function showAllUsers(req: Request, res: Response) {
	const users = await userRepository.findAndCount();

	res.status(200).json({ content: users });
}
