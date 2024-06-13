import { Request, Response } from 'express';
import DataSource from '../db/DataSource';
import { Field } from '../entity/Field';
import { Farm } from '../entity/Farm';
import { DefensiveHistory } from '../entity/DefensiveHistory';
import { fetchWeatherData } from '../modules/utils';

const fieldRepository = DataSource.getRepository(Field);
const farmRepository = DataSource.getRepository(Farm);
const defensiveRepository = DataSource.getRepository(DefensiveHistory);

export async function createNewField(req: Request, res: Response) {
	const userID = res.locals.claims.userid;
	const farmID = req.params.farmid;

	const farm = await farmRepository.findOneBy({
		id: farmID,
		userId: userID,
	});

	if (!farm || farm.userId != userID) {
		return res.status(404).json({ errors: 'Farm not found' });
	}

	const coords: string = req.body.coordinates;

	const regex = /LatLng\(lat: ([-+]?[0-9]+\.[0-9]*), lng: ([-+]?[0-9]+\.[0-9]*)\)/;
	const coordsMatch = regex.exec(coords);

	if (!coordsMatch) {
		return res.status(400).json({ errors: 'Invalid coordinates format' });
	}

	const field = fieldRepository.create();
	field.name = req.body.name;
	field.size = req.body.size;
	field.latitude = coordsMatch[1];
	field.longitude = coordsMatch[2];
	field.farm = farm;

	try {
		await fieldRepository.save(field);
		farm.numberOfFields++;
		await farmRepository.save(farm);
	} catch (err) {
		console.error('Error when saving a new field or updating farm', err);
		return res.status(500).json({ errors: 'Internal Error' });
	}

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

	fields.forEach((field) => {
		delete (field as { createdAt?: number }).createdAt;
		delete (field as { updatedAt?: number }).updatedAt;
		delete (field as { latitude?: string }).latitude;
		delete (field as { longitude?: string }).longitude;
		delete (field as { farmId?: string }).farmId;
	});

	res.status(200).json({ data: fields });
}

export async function getField(req: Request, res: Response) {
	const userID = res.locals.claims.userid;
	const farmID = req.params.farmid;
	const fieldID = req.params.fieldid;

	const farmWithField = await farmRepository.find({
		where: {
			id: farmID,
			userId: userID,
			fields: {
				id: fieldID,
			},
		},

		relations: {
			fields: true,
		},
	});

	const farm = await farmRepository.findOneBy({
		id: farmID,
		userId: userID,
	});

	if (!farm) {
		return res.status(404).json({ errors: 'Farm not found' });
	}

	const field = await fieldRepository.findOneBy({
		id: fieldID,
		farmId: farmID,
	});

	if (!field) {
		return res.status(404).json({ errors: 'Field not found' });
	}

	return res.status(200).json({ data: field });
}

export async function getAllWheaterData(req: Request, res: Response) {
	const userID = res.locals.claims.userid;
	const farmID = req.params.farmid;
	const fieldID = req.params.fieldid;
	const days = req.body.days;

	const farm = await farmRepository.findOneBy({
		id: farmID,
		userId: userID,
	});

	if (!farm) {
		return res.status(404).json({ errors: 'Farm not found' });
	}

	const field = await fieldRepository.findOneBy({
		id: fieldID,
		farmId: farmID,
	});

	if (!field) {
		return res.status(404).json({ errors: 'Field not found' });
	}

	const weatherData = await fetchWeatherData(field.latitude, field.longitude, days);

	res.status(200).json({ count: weatherData.length, data: weatherData });
}

export async function saveDefensiveRecord(req: Request, res: Response) {
	const userID = res.locals.claims.userid;
	const farmID = req.params.farmid;
	const fieldID = req.params.fieldid;

	const farm = await farmRepository.findOneBy({
		id: farmID,
		userId: userID,
	});

	if (!farm) {
		return res.status(404).json({ errors: 'Farm not found' });
	}

	const field = await fieldRepository.findOneBy({
		id: fieldID,
		farmId: farmID,
	});

	if (!field) {
		return res.status(404).json({ errors: 'Field not found' });
	}

	const defensiveRecord = defensiveRepository.create();
	defensiveRecord.agrodefensive = req.body.name;
	defensiveRecord.volume = req.body.volume;
	defensiveRecord.field = field;

	await defensiveRepository.save(defensiveRecord);

	res.status(201).json({ message: 'Agrodefensive record saved with success' });
}

export async function getAllDefensivesRecords(req: Request, res: Response) {}
