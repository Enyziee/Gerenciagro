import express, { json, urlencoded, type Express } from 'express';
import morgan from 'morgan';
import routes from '../routes';

export function createServer(): Express {
	const app = express();
    app.use(morgan('dev'));
    app.use(json());
    app.use(urlencoded({ extended: true }));
    app.use('/api', routes());
    
	return app;
}
