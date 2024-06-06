import { Router } from 'express';
import authentication from './authRoutes';
import users from './userRoutes';
import farmsRoutes from './farmsRoutes';

const router = Router();

export default (): Router => {
	users(router);
	farmsRoutes(router);
	authentication(router);

	return router;
};
