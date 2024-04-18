import { createUser, showAllUsers, getUserInfo } from '../controllers/users';
import express from 'express';
import { checkJWT } from '../middleware/authentication';

export default (router: express.Router) => {
	router.post('/users', createUser);

	router.get('/user', checkJWT, getUserInfo);

	router.get('/users', checkJWT, showAllUsers);
};
