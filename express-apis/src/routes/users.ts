import express from 'express';

import { createNewFarm, showAllFarms, showFarm } from '../controllers/farms';
import { showUserInfo } from '../controllers/users';
import { checkJWT } from '../middleware/authentication';

export default (router: express.Router) => {
	router.get('/users', checkJWT, showUserInfo);

	router.post('/farms', checkJWT, createNewFarm);

	router.get('/farms', checkJWT, showAllFarms);

	router.get('/farms:id', checkJWT, showFarm);
};
