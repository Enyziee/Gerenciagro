import { Router } from 'express';
import { login, refreshJWT, register } from '../controllers/authController';
import { body, header } from 'express-validator';
import { validationErrorHandler } from '../modules/validations';

export default (router: Router) => {
	router.post('/auth/login', body('email').isEmail(), body('password').notEmpty(), validationErrorHandler, login);

	router.post(
		'/auth/register',
		body('name').notEmpty(),
		body('email').isEmail(),
		body('password').notEmpty(),
		body('address').notEmpty(),
		validationErrorHandler,
		register,
	);

	router.post(
		'/auth/refresh',
		body('refresh_token').notEmpty().isHexadecimal().isLength({ min: 32, max: 32 }),
		validationErrorHandler,
		refreshJWT,
	);
};
