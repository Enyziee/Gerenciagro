import { NextFunction, Request, Response } from 'express';
import { validadeJWT } from '../modules/authentication';

import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken';

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
		if (err instanceof TokenExpiredError) {
			console.warn('JWT Expired');
			return res.status(401).json({ message: 'JWT Expired' });
		}
		
		if (err instanceof JsonWebTokenError) { 
			console.warn('JWT invalid');
			return res.status(401).json({ message: 'JWT invalid' });
		}
	}
}
