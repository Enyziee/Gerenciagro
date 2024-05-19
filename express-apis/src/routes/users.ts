import { showAllFarms, showUserInfo } from '../controllers/users';
import express from 'express';
import { checkJWT } from '../middleware/authentication';
import { createNewFarm } from '../controllers/farms';

export default (router: express.Router) => {
	router.get('/users', checkJWT, showUserInfo);

	router.post('/users/farms', checkJWT, createNewFarm);

	router.get('/users/farms', checkJWT, showAllFarms);
};
