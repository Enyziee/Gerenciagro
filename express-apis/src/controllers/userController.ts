import { Request, Response } from 'express';
import { User } from '../entity/User';
import DataSource from '../db/DataSource';

const userRepository = DataSource.getRepository(User);

export async function showUserInfo(req: Request, res: Response) {
	const user = await userRepository.findOneBy({
		id: res.locals.claims.userid,
	});

	if (!(user instanceof User)) {
		return res.status(404).json({ error: 'User not found' });
	}

	delete (user as { password?: string }).password;
	return res.status(200).json({ content: user });
}

export async function updateUserInfo(req: Request, res: Response) {
	res.json({ message: 'Not implemented' });
}

export async function deleteUserFromJWT(req: Request, res: Response) {
	const userID = res.locals.claims.userid;

	res.json({ message: `User ${userID} deleted` });
}
