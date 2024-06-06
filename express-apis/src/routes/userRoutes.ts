import express from 'express';

import { showUserInfo } from '../controllers/userController';
import { checkJWT } from '../middleware/authentication';

export default (router: express.Router) => {
	router.get('/users', checkJWT, showUserInfo);
};
