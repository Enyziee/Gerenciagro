import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export function validationErrorHandler(req: Request, res: Response, next: NextFunction) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		res.status(400);
		return res.json({ errors: result.array() });
	}

	next();
}
