import morgan from 'morgan';
import 'reflect-metadata';

// import { json, urlencoded } from 'body-parser';
import express, { json, urlencoded } from 'express';
import DataSource from './db/DataSource';
import routes from './routes/index';

const PORT = process.env.EXPRESS_PORT ? process.env.EXPRESS_PORT : 8080;
const app = express();

app.use(morgan('dev'));
// app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use('/api', routes());

DataSource.initialize()
	.then(async () => {
		app.listen(PORT, async () => {
			console.log(`Server listening on http://localhost:${PORT}`);
		});
	})
	.catch((err: Error) => {
		console.error(err.stack);
		process.exit(-1);
	});
