import { NextFunction, Request, Response } from 'express';
import { validadeJWT } from '../modules/authentication';

export async function checkJWT(req: Request, res: Response, next: NextFunction) {
	const bearer = req.headers.authorization;

	if (!bearer) {
		res.status(401);
		res.json({ message: 'not authorized' });
		return;
	}

	const [, token] = bearer.split(' ');

	if (!token) {
		res.status(401);
		res.json({ message: 'not valid token' });
		return;
	}

	try {
		const user = await validadeJWT(token);
		console.log(user);
		res.locals.user = user;
		next();
	} catch (error) {
		console.error(error);
		res.status(401);
		res.json('not valid token');
	}
}
