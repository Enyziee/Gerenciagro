import express, { json, Request, Response, urlencoded, type Express } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import morgan from 'morgan';
import { fetchWeatherApi } from 'openmeteo';
import { User } from '../entity/User';
import routes from '../routes';
import { createJWT, createRefreshToken, validadeJWT } from './authentication';

type weatherRecord = {
	timestamp: string;
	precipitation: number;
};

export function decodeHeader(req: Request, res: Response) {
	const authHeader = req.headers.authorization;

	const bearer = req.headers.authorization;

	if (!bearer) {
		res.status(401);
		res.json({ message: 'Authentication header not provided' });
		console.log('Authentication header not provided');
		return;
	}

	const [, token] = bearer.split(' ');

	if (!token) {
		res.status(401);
		res.json({ message: 'Authentication JWT not provided' });
		console.log('Authentication JWT not provided');
		return;
	}

	return token;
}

export async function createAuthData(user: User) {
	const accessToken = await createJWT(user);
	const accessTokenData = (await validadeJWT(accessToken)) as JwtPayload;
	const refreshData = createRefreshToken(user);

	delete (user as { password?: string }).password;
	delete (user as { updatedAt?: Date }).updatedAt;
	return {
		access_token: { token: accessToken, expireAt: accessTokenData.exp as number },
		refresh_token: { token: refreshData.token, expireAt: Math.floor(refreshData.expiresAt.getTime() / 1000) },
		user_data: {
			id: user.id,
			email: user.email,
			name: user.name,
			address: user.address,
			createdAt: user.createdAt,
		},
	};
}

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
		if (!isNaN(weatherData.daily.precipitationSum[i])) {
			weatherRecords.push({
				timestamp: weatherData.daily.time[i].toISOString(),
				precipitation: weatherData.daily.precipitationSum[i],
			});
		}
	}

	return weatherRecords;
}

export function createServer(): Express {
	const app = express();
	app.use(morgan('short'));
	app.use(json());
	app.use(urlencoded({ extended: true }));
	app.use('/api', routes());

	return app;
}
