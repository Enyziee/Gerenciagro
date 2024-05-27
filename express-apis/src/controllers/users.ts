import { Request, Response } from 'express';
import { User } from '../entity/User';
import DataSource from '../db/DataSource';

const userRepository = DataSource.getRepository(User);

export async function showUserInfo(req: Request, res: Response) {
	const userId: string = res.locals.claims.userid;

	if (!userId) {
		return res.status(401).json({ error: 'ID not provided' });
	}

	if (userId.length != 36) {
		return res.status(400).json({ error: 'Invalid ID' });
	}

	const user = await userRepository.findOneBy({
		id: userId,
	});

	if (!(user instanceof User)) {
		res.status(404).json({ error: 'Not found' });
	}

	delete (user as { password?: string }).password;
	return res.status(200).json({ content: user });
}
