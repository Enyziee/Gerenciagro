import 'reflect-metadata';

import DataSource from './db/DataSource';
import { createServer } from './modules/utils';
import { EXPRESS_PORT } from './config';

const PORT = EXPRESS_PORT;
const app = createServer();

DataSource.initialize()
	.then(() => {
		app.listen(PORT, async () => {
			console.log(`API Server started at port:${PORT}`);
		});
	})
	.catch((err: Error) => {
		console.error(err);
		process.exit(1);
	});
