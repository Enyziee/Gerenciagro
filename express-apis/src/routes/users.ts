import { showAllFarms, createNewUser, showUserInfo } from '../controllers/users';
import express from 'express';
import { checkJWT } from '../middleware/authentication';
import { createNewFarm } from '../controllers/farms';

export default (router: express.Router) => {
	router.post('/users', createNewUser);

	router.get('/users', checkJWT, showUserInfo);

	router.post('/users/{id}/farms', checkJWT, createNewFarm);

	router.get('/users/{id}/farms', checkJWT, showAllFarms);
};
