import express from 'express';
import { login, register } from '../controllers/authentication';
import { showUsers } from '../controllers/users';

export default (router: express.Router) => {
	router.post('/users', register);

	router.get('/users', showUsers);

	router.post('/auth/login', login);

	router.get('/', async (req: express.Request, res: express.Response) => {
		res.send('<h1>API Bolada</h1>');
	});
};
