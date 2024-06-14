import { NextFunction, Request, Response } from 'express';
import { validadeJWT } from '../modules/authentication';

export async function checkJWT(req: Request, res: Response, next: NextFunction) {
	const bearer = req.headers.authorization;

	if (!bearer) {
		res.status(401).json({ message: 'Authentication header not provided' });
		console.log('Authentication header not provided');
		return;
	}

	const [, token] = bearer.split(' ');

	if (!token) {
		res.status(401).json({ message: 'Authentication JWT not provided' });
		console.log('Authentication JWT not provided');
		return;
	}

	try {
		const claims = await validadeJWT(token);
		res.locals.claims = claims;
		next();
	} catch (err) {
		console.error(err);
		res.status(401).json({ message: 'Invalid Token' });
	}
}
