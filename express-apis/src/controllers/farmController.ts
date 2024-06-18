import { Request, Response } from 'express';
import DataSource from '../db/DataSource';
import { Farm } from '../entity/Farm';
import { User } from '../entity/User';
import { Field } from '../entity/Field';
import { DefensiveHistory } from '../entity/DefensiveHistory';

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

export async function updateFarmInfo(req: Request, res: Response) {
	const userID = res.locals.claims.userid;
	const farmID = req.params.farmid;

	const farm = await farmRepository.findOneBy({
		id: farmID,
		userId: userID,
	});

	if (!farm) {
		return res.status(404).json({ message: 'Farm not found' });
	}

	if (req.body.name && req.body.name.length > 0) {
		farm.name = req.body.name;
	}

	if (req.body.address && req.body.address.length > 0) {
		farm.address = req.body.address;
	}

	try {
		await farmRepository.save(farm);
		res.json({ message: 'Farm data updated with success' });
	} catch (err) {
		console.error('Cannot update the farm data', err);
		return res.status(500).json({ message: 'Cannot update the farm data' });
	}
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

export async function deleteFarm(req: Request, res: Response) {
	const fieldRepository = DataSource.getRepository(Field);
	const defensiveRepository = DataSource.getRepository(DefensiveHistory);

	const userID = res.locals.claims.userid;
	const farmID = req.params.farmid;

	const farms = await farmRepository.find({
		where: {
			id: farmID,
			userId: userID,
		},

		relations: {
			fields: {
				defensiveHistory: true,
			},
		},
	});

	if (farms.length == 0) {
		return res.status(404).json({ message: 'Farm not found' });
	}

	const farm = farms[0];

	try {
		farm.fields.forEach(async (field) => {
			field.defensiveHistory.forEach(async (defensiveRecord) => {
				await defensiveRepository.remove(defensiveRecord);
			});

			await fieldRepository.remove(field);
		});

		await farmRepository.remove(farm);
		return res.status(200).json({ message: 'Farm deleted with success' });
	} catch (err) {
		console.error('Cannot delete the farm', err);
		return res.status(500).json({ message: 'Cannot delete the farm' });
	}
}
