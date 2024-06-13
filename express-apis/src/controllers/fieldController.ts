import { Request, Response } from 'express';
import DataSource from '../db/DataSource';
import { Field } from '../entity/Field';
import { Farm } from '../entity/Farm';
import { fetchWeatherApi } from 'openmeteo';
import { ClimateHistory } from '../entity/ClimateHistory';
import { DefensiveHistory } from '../entity/DefensiveHistory';

const fieldRepository = DataSource.getRepository(Field);
const farmRepository = DataSource.getRepository(Farm);
const climateRepo = DataSource.getRepository(ClimateHistory);
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

export async function climateData(req: Request, res: Response) {
	const userID = res.locals.claims.userid;
	const farmID = req.params.farmid;
	const fieldID = req.params.fieldid;
	const days = req.body.days;

	const field = await fieldRepository.findOneBy({
		id: fieldID,
		farmId: farmID,
	});

	const farm = await farmRepository.findOneBy({
		id: farmID,
		userId: userID,
	});

	if (!field || !farm) {
		return res.status(404).send();
	}

	const myDate = new Date();

	const currentDate = new Date().toISOString().slice(0, 10);
	myDate.setDate(new Date().getDate() - days);
	const startDate = myDate.toISOString().slice(0, 10);

	const params = {
		latitude: field.latitude,
		longitude: field.longitude,
		start_date: startDate,
		end_date: currentDate,
		daily: ['temperature_2m_mean', 'precipitation_sum'],
		timezone: 'America/Sao_Paulo',
	};
	const url = 'https://archive-api.open-meteo.com/v1/archive';
	const responses = await fetchWeatherApi(url, params);

	// Helper function to form time ranges
	const range = (start: number, stop: number, step: number) =>
		Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

	// Process first location. Add a for-loop for multiple locations or weather models
	const response = responses[0];

	// Attributes for timezone and location
	const utcOffsetSeconds = response.utcOffsetSeconds();
	const timezone = response.timezone();
	const timezoneAbbreviation = response.timezoneAbbreviation();
	const latitude = response.latitude();
	const longitude = response.longitude();

	const daily = response.daily()!;

	// Note: The order of weather variables in the URL query and the indices below need to match!
	const weatherData = {
		daily: {
			time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
				(t) => new Date((t + utcOffsetSeconds) * 1000),
			),
			temperature2mMean: daily.variables(0)!.valuesArray()!,
			precipitationSum: daily.variables(1)!.valuesArray()!,
		},
	};

	// `weatherData` now contains a simple structure with arrays for datetime and weather data
	for (let i = 0; i < weatherData.daily.time.length; i++) {
		console.log(
			weatherData.daily.time[i].toISOString(),
			weatherData.daily.temperature2mMean[i],
			weatherData.daily.precipitationSum[i],
		);
	}

	const climateRecords = [];

	for (let i = 0; i < weatherData.daily.time.length; i++) {
		const record = climateRepo.create();

		if (isNaN(weatherData.daily.precipitationSum[i])) {
			continue;
		}

		record.precipitationSum = weatherData.daily.precipitationSum[i];
		record.timestamp = weatherData.daily.time[i];

		record.field = field;

		climateRecords.push(record);
	}
	
	DataSource.getRepository(ClimateHistory).insert(climateRecords);

	res.status(200).json({ data: weatherData });
}

export async function getAllClimateRecords(req: Request, res: Response) {}

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
	
	res.status(201).json({message: 'Agrodefensive record saved with success'});
}

export async function getAllDefensivesRecords(req: Request, res: Response) {}
