import express from 'express';

import { deleteUserFromJWT, showUserInfo, updateUserInfo } from '../controllers/userController';
import { checkJWT } from '../middleware/middlewares';
import { body } from 'express-validator';
import { validationErrorHandler } from '../modules/validations';

export default (router: express.Router) => {
	router.get('/users', checkJWT, showUserInfo);

	router.put(
		'/users',
		body('name').notEmpty().optional(),
		body('email').isEmail().optional(),
		body('address').notEmpty().optional(),

		validationErrorHandler,
		checkJWT,
		updateUserInfo,
	);

	router.delete('/users', checkJWT, deleteUserFromJWT);
};
