import { Router } from 'express';
import { login, register } from '../controllers/authentication';

export default (router: Router) => {
	router.post('/auth/login', login);

	// router.post('/auth/logout', logout);

	router.post('/auth/register', register);
};
