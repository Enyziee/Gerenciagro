import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import DataSource from '../db/DataSource';
import { Field } from '../entity/Field';
import { Farm } from '../entity/Farm';

export function validationErrorHandler(req: Request, res: Response, next: NextFunction) {
	const result = validationResult(req);
	if (!result.isEmpty()) {
		res.status(400);
		return res.json({ errors: result.array() });
	}

	next();
}

export async function validateFieldOwner(userID: string, farmID: string, field: Field) {
	const farmRepo = DataSource.getRepository(Farm);

	const farm = await farmRepo.findOneBy({
		id: farmID,
		userId: userID,
	});

	if (!farm) {
		return false;
	}

	if (field.farmId != farm.id) {
		return false;
	}

	return true;
}
