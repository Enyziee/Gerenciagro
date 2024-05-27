import { Request, Response } from 'express';
import DataSource from '../db/DataSource';
import { Farm } from '../entity/Farm';
import { User } from '../entity/User';

const farmRepository = DataSource.getRepository(Farm);
const userRepository = DataSource.getRepository(User);

export async function createNewFarm(req: Request, res: Response) {
	const userID = res.locals.claims.userid;
	const { name, address } = req.body;

	const user = await userRepository.findOneBy({
		id: userID,
	});

	if (!user) {
		return res.status(401).json({ error: '...' });
	}

	const farm = farmRepository.create({ name: name, user: user, address: address });
	await farmRepository.save(farm);

	res.json({ message: 'Farm created with success' });
}

export async function showFarm(req: Request, res: Response) {
	const farm = await farmRepository.findOneBy({
		id: req.params.id,
	});

	if (!farm) {
		return res.status(404).json({ error: 'Farm not found in the databases' });
	}

	res.status(200).json({ data: farm });
}
export async function showAllFarms(req: Request, res: Response) {
	const farms = await farmRepository.findBy({
		user: {
			id: res.locals.claims.userid,
		},
	});

	res.status(200).json({ data: farms });
}
