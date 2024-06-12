import 'reflect-metadata';

import DataSource from './db/DataSource';
import { createServer } from './modules/utils';

const PORT = process.env.EXPRESS_PORT ? process.env.EXPRESS_PORT : 3000;
const app = createServer();

DataSource.initialize()
	.then(() => {
		app.listen(PORT, async () => {
			console.log(`Server listening on http://localhost:${PORT}`);
		});
	})
	.catch((err: Error) => {
		console.error(err);
		process.exit(1);
	});
