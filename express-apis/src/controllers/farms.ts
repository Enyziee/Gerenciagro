import { Request, Response } from 'express';
import DataSource from '../db/DataSource';
import { Farm } from '../entity/Farm';
import { User } from '../entity/User';

const farmRepository = DataSource.getRepository(Farm);
const userRepository = DataSource.getRepository(User);

export async function createNewFarm(req: Request, res: Response) {
	const userID = res.locals.claims.sub;
	const { name, address } = req.body;

	const user = await userRepository.findOneBy({
		id: userID,
	});

	if (!user) {
		return res.status(401).json({ message: '...' });
	}

	const farm = new Farm();
	farm.name = name;
	farm.user = user;
	farm.address = address;

	await farmRepository.save(farm);

	return res.json('Ok 👍');
}
