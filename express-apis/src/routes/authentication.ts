import { Router } from 'express';
import { singin } from '../controllers/authentication';

export default (router: Router) => {
	router.post('/auth/login', singin);
};
