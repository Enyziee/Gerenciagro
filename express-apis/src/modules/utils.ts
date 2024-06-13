import express, { json, urlencoded, type Express } from 'express';
import morgan from 'morgan';
import routes from '../routes';
import { fetchWeatherApi } from 'openmeteo';

type weatherRecord = {
	timestamp: string;
	precipitation: number;
};

export async function fetchWeatherData(latitude: string, longitude: string, days: number) {
	const myDate = new Date();

	const currentDate = new Date().toISOString().slice(0, 10);
	myDate.setDate(new Date().getDate() - days);
	const startDate = myDate.toISOString().slice(0, 10);

	const params = {
		latitude: latitude,
		longitude: longitude,
		start_date: startDate,
		end_date: currentDate,
		daily: ['precipitation_sum'],
		timezone: 'America/Sao_Paulo',
	};
	const url = 'https://archive-api.open-meteo.com/v1/archive';
	const responses = await fetchWeatherApi(url, params);

	// Helper function to form time ranges
	const range = (start: number, stop: number, step: number) =>
		Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

	const response = responses[0];
	const utcOffsetSeconds = response.utcOffsetSeconds();

	const daily = response.daily()!;

	const weatherData = {
		daily: {
			time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
				(t) => new Date((t + utcOffsetSeconds) * 1000),
			),
			precipitationSum: daily.variables(0)!.valuesArray()!,
		},
	};

	let weatherRecords: weatherRecord[] = [];

	for (let i = 0; i < weatherData.daily.time.length; i++) {
		weatherRecords.push({
			timestamp: weatherData.daily.time[i].toISOString(),
			precipitation: weatherData.daily.precipitationSum[i],
		});
	}

	return weatherRecords;
}

export function createServer(): Express {
	const app = express();
	app.use(morgan('dev'));
	app.use(json());
	app.use(urlencoded({ extended: true }));
	app.use('/api', routes());

	return app;
}
