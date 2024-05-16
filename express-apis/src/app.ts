import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { json } from 'body-parser';
import 'reflect-metadata';

import DataSource from './db/DataSource';
import routes from './routes/index';

const PORT = process.env.EXPRESS_PORT ? process.env.EXPRESS_PORT : 8080;
const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(json());

app.use('/api', routes());

DataSource.initialize()
	.then(async () => {
		app.listen(PORT, async () => {
			console.log(`Server listening on http://localhost:${PORT}`);
		});
	})
	.catch((error: unknown) => {
		console.log('Database inaccesible');
		console.error(error);
	});
