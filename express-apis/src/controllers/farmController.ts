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
		return res.status(401).json({ message: '' });
	}

	const farm = farmRepository.create({ name: name, user: user, address: address, numberOfFields: 0 });
	await farmRepository.save(farm);

	res.json({ message: 'Farm created with success', data: { farm_id: farm.id } });
}

export async function showFarm(req: Request, res: Response) {
	const farm = await farmRepository.findOneBy({
		id: req.params.farmid,
	});

	if (!farm) {
		return res.status(404).json({ message: 'Farm not found in the databases' });
	}

	res.status(200).json({ data: farm });
}
export async function showAllFarms(req: Request, res: Response) {
	const farms = await farmRepository.findBy({
		user: {
			id: res.locals.claims.userid,
		},
	});

	farms.forEach((farm) => {
		delete (farm as { createdAt?: Date }).createdAt;
		delete (farm as { updatedAt?: Date }).updatedAt;
		delete (farm as { userId?: string }).userId;
	});

	res.status(200).json({ data: farms });
}
