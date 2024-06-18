import { Request, Response } from 'express';
import { User } from '../entity/User';
import DataSource from '../db/DataSource';

const userRepository = DataSource.getRepository(User);

export async function showUserInfo(req: Request, res: Response) {
	const user = await userRepository.findOneBy({
		id: res.locals.claims.userid,
	});

	if (!(user instanceof User)) {
		return res.status(404).json({ message: 'User not found' });
	}

	delete (user as { password?: string }).password;
	return res.status(200).json({ content: user });
}

export async function updateUserInfo(req: Request, res: Response) {
	const user = await userRepository.findOneBy({
		id: res.locals.claims.userid,
	});

	if (!user) {
		return res.status(404).json({ message: 'User not found' });
	}

	if (req.body.name && req.body.name.length > 0) {
		user.name = req.body.name;
	}

	if (req.body.email) {
		user.email = req.body.email;
	}

	if (req.body.address && req.body.address.length > 0) {
		user.address = req.body.address;
	}

	try {
		await userRepository.save(user);
		res.status(200).json({ message: 'User data updated with success' });
	} catch (err) {
		console.error('Cannot update user data', err);
		return res.status(500).json({ message: 'Cannot update user data' });
	}
}

export async function deleteUserFromJWT(req: Request, res: Response) {
	const userID = res.locals.claims.userid;

	res.json({ message: `User ${userID} deleted` });
}
