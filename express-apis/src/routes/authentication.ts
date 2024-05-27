import { NextFunction, Request, Response, Router } from 'express';
import { login, register } from '../controllers/authentication';
import { body, validationResult } from 'express-validator';

function validationErrorHandler(req: Request, res: Response, next: NextFunction) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		res.status(400);
		res.json({ errors: result.array() });
	} else {
		next();
	}
}

export default (router: Router) => {
	router.post('/auth/login', body('email').isEmail(), body('password').notEmpty(), validationErrorHandler, login);

	// router.post('/auth/logout', logout);

	router.post(
		'/auth/register',
		body('name').notEmpty(),
		body('email').isEmail(),
		body('password').notEmpty(),
		body('address').notEmpty(),
		validationErrorHandler,
		register,
	);
};
