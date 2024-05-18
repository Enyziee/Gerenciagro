import { Request, Response } from 'express';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import DataSource from '../db/DataSource';

const userRepository = DataSource.getRepository(User);

export async function createNewUser(req: Request, res: Response) {
	const { name, email, password, address } = req.body;

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

export async function showUserInfo(req: Request, res: Response) {
	const userId = res.locals.claims.sub;

	const user = await userRepository.findOneBy({
		id: userId,
	});

	res.send(200).json({ content: user });
}

export async function showAllUsers(req: Request, res: Response) {
	const users = await userRepository.findAndCount();

	res.status(200).json({ content: users });
}

export async function showAllFarms(req: Request, res: Response) {
	res.send('ok');
}
