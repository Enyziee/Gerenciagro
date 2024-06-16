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
		return res.status(404).json({ message: 'Farm not found' });
	}

	const coords: string = req.body.coordinates;

	const regex = /LatLng\(lat: ([-+]?[0-9]+\.[0-9]*), lng: ([-+]?[0-9]+\.[0-9]*)\)/;
	const coordsMatch = regex.exec(coords);

	if (!coordsMatch) {
		return res.status(400).json({ message: 'Invalid coordinates format' });
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
		return res.status(500).json({ message: 'Internal Error' });
	}

	res.status(201).json({ message: 'Field created with success', data: { field_id: field.id } });
}

export async function updateFieldInfo(req: Request, res: Response) {
	const userID = res.locals.claims;
	const farmID = req.params.farmid;
	const fieldID = req.params.fieldid;

	const farmWithField = await farmRepository.find({
		where: {
			id: farmID,
			fields: {
				id: fieldID,
			},
		},

		relations: {
			fields: true,
		},
	});

	if (farmWithField.length == 0) {
		return res.status(404).json({ message: 'Resource not found' });
	}

	const field = farmWithField[0].fields[0];

	if (req.body.name && req.body.name.length > 0) {
		field.name = req.body.name;
	}

	if (req.body.size) {
		field.size = req.body.size;
	}

	if (req.body.coordinates && req.body.coordinates.length > 0) {
		const coords: string = req.body.coordinates;

		const regex = /LatLng\(lat: ([-+]?[0-9]+\.[0-9]*), lng: ([-+]?[0-9]+\.[0-9]*)\)/;
		const coordsMatch = regex.exec(coords);

		if (!coordsMatch) {
			return res.status(400).json({ message: 'Invalid coordinates format' });
		}

		field.latitude = coordsMatch[1];
		field.longitude = coordsMatch[2];
	}

	try {
		await fieldRepository.save(field);
	} catch (error) {
		console.error('Cannot update field data', error);
		return res.status(500).json({ message: 'Cannot update the field data' });
	}

	res.status(200).json({ data: field });
}

export async function deleteField(req: Request, res: Response) {}

export async function getAllFieldsFromFarm(req: Request, res: Response) {
	const userID = res.locals.claims.userid;
	const farmID = req.params.farmid;

	const farmWithField = await farmRepository.find({
		where: {
			id: farmID,
			userId: userID,
		},

		relations: {
			fields: true,
		},
	});

	if (!farmWithField[0]) {
		return res.status(404).json({ message: 'Resource not found' });
	}

	const fields = farmWithField[0].fields;

	fields.forEach((field) => {
		delete (field as { createdAt?: Date }).createdAt;
		delete (field as { updatedAt?: Date }).updatedAt;
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

	if (!farmWithField[0] || !farmWithField[0].fields[0]) {
		return res.status(404).json({ message: 'Resource not found' });
	}

	return res.status(200).json({ data: farmWithField[0].fields[0] });
}

export async function getAllWeatherData(req: Request, res: Response) {
	const userID = res.locals.claims.userid;
	const farmID = req.params.farmid;
	const fieldID = req.params.fieldid;

	const days = parseInt(req.query.days!.toString());

	if (days < 1 || days > 365) {
		return res.status(400).json({ message: 'Value out of range' });
	}

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

	if (!farmWithField[0] || !farmWithField[0].fields[0]) {
		return res.status(404).json({ message: 'Resource not found' });
	}

	const field = farmWithField[0].fields[0];

	try {
		const weatherData = await fetchWeatherData(field.latitude, field.longitude, days);
		res.status(200).json({ count: weatherData.length, data: weatherData });
	} catch (err) {
		console.error('Problem fetching weather data from OpenMeteo\n', err);
		res.status(500).json({ message: err });
	}
}

export async function saveDefensiveRecord(req: Request, res: Response) {
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

	if (!farmWithField[0] || !farmWithField[0].fields[0]) {
		return res.status(404).json({ message: 'Resource not found' });
	}

	const field = farmWithField[0].fields[0];

	const defensiveRecord = defensiveRepository.create();
	defensiveRecord.agrodefensive = req.body.name;
	defensiveRecord.volume = req.body.volume;
	defensiveRecord.field = field;

	await defensiveRepository.save(defensiveRecord);

	res.status(201).json({ message: 'Agrodefensive record saved with success' });
}

export async function getAllDefensivesRecords(req: Request, res: Response) {
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
			fields: { defensiveHistory: true },
		},
	});

	if (!farmWithField[0] || !farmWithField[0].fields[0]) {
		return res.status(404).json({ message: 'Resource not found' });
	}

	const defensives = farmWithField[0].fields[0].defensiveHistory;

	res.status(200).json({ data: defensives });
}
