import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

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
		const user = verify(token, process.env.JWT_TOKEN!);
		res.locals.user = user;
		next();
	} catch (error) {
		console.error(error);
		res.status(401);
		res.json('not valid token');
	}
}
