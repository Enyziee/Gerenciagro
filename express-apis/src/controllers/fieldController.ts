import { Request, Response } from 'express';
import DataSource from '../db/DataSource';
import { Field } from '../entity/Field';
import { Farm } from '../entity/Farm';
import { User } from '../entity/User';

const fieldRepository = DataSource.getRepository(Field);
const farmRepository = DataSource.getRepository(Farm);
const userRepository = DataSource.getRepository(User);

export async function createNewField(req: Request, res: Response) {
	const userID = res.locals.claims.userid;
	const farmID = req.params.farmid;

	const farm = await farmRepository.findOneBy({
		id: farmID,
	});

	if (!farm || farm.userId != userID) {
		return res.status(404).json({ erros: 'Farm not found' });
	}

	const field = fieldRepository.create();
	field.name = req.body.name;
	field.size = req.body.size;
	field.farm = farm;

	await fieldRepository.save(field);

	res.status(201).json({ message: 'Field created with success', data: { field_id: field.id } });
}

export async function getAllFieldsFromFarm(req: Request, res: Response) {
	const userID = res.locals.claims.userid;
	const farmID = req.params.farmid;

	const farm = await farmRepository.findOneBy({
		id: farmID,
	});

	if (!farm || farm.userId != userID) {
		return res.status(404).json({ errors: 'Farm not found' });
	}

	const fields = await fieldRepository.findBy({
		farmId: farmID,
	});

	res.status(200).json({ data: fields });
}

export async function getField(req: Request, res: Response) {
	const userID = res.locals.claims.userid;
	const farmID = req.params.farmid;
	const fieldID = req.params.fieldid;

	const farm = await farmRepository.findOneBy({
		id: farmID,
		userId: userID,
	});

	if (!farm) {
		return res.status(404).json({ errors: 'Field not found' });
	}

	const field = await fieldRepository.findOneBy({
		id: fieldID,
		farm: farm,
	});

	return res.status(200).json({ data: field });
}
