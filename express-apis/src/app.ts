import { json } from 'body-parser';
import express from 'express';
import { AppDataSource } from './db/AppDataSource';

import routes from './routes';
import morgan from 'morgan';
const PORT = process.env.EXPRESS_PORT;
const app = express();

app.use(morgan('dev'));
// app.use(cors());
app.use(json());

app.use('/api', routes());

AppDataSource.initialize()
	.then(async () => {
		app.listen(PORT, async () => {
			console.log(`Server listening on http://localhost:${PORT}`);
		});
	})
	.catch((error: unknown) => {
		console.log('Database inaccesible');
		console.error(error);
	});
