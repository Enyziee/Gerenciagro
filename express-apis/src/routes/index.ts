import { Router } from 'express';
import authentication from './authentication';
import users from './users';

const router = Router();

export default (): Router => {
	users(router);
	authentication(router);

	return router;
};
