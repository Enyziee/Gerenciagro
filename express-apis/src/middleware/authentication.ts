import { NextFunction, Request, Response } from 'express';
import { validadeJWT } from '../modules/authentication';

export async function checkJWT(req: Request, res: Response, next: NextFunction) {
	const bearer = req.headers.authorization;

	if (!bearer) {
		res.status(401);
		res.json({ message: 'Unauthorized' });
		return;
	}

	const [, token] = bearer.split(' ');

	if (!token) {
		res.status(401);
		res.json({ message: 'Invalid Token' });
		return;
	}

	try {
		const claims = await validadeJWT(token);
		res.locals.claims = claims;
		next();
	} catch (error) {
		console.error(error);
		res.status(401);
		res.json({ message: 'Invalid Token' });
	}
}
