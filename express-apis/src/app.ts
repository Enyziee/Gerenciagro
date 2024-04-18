import { json } from 'body-parser';
import express from 'express';
import db from './db';
import routes from './routes';
import morgan from 'morgan';
const PORT = process.env.EXPRESS_PORT;
const app = express();

app.use(morgan('dev'));
app.use(json());

app.use('/api', routes());

app.listen(PORT, async () => {
	const conn = await db.connect();
	conn.release();

	console.log(`Server listening on http://localhost:${PORT}`);
});
