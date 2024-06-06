import { Router } from 'express';
import { checkJWT } from '../middleware/authentication';
import { createNewFarm, showAllFarms, showFarm } from '../controllers/farmController';
import { body, param } from 'express-validator';
import { validationErrorHandler } from '../modules/validations';
import { createNewField, getAllFieldsFromFarm, getField } from '../controllers/fieldController';

export default (router: Router) => {
	// Only farms endpoints

	// Return all farms from a authenticated user
	router.get('/farms', checkJWT, showAllFarms);

	// Create a new farm for the authenticated user
	router.post(
		'/farms',
		body('name').isString(),
		body('address').isString(),
		validationErrorHandler,
		checkJWT,
		createNewFarm,
	);

	// Return only the farm that matchs the ID passed by route paramater
	router.get('/farms/:farmid', param('farmid').isUUID(), validationErrorHandler, checkJWT, showFarm);

	router.get('/farms/:farmid/fields', param('farmid').isUUID(), validationErrorHandler, checkJWT, getAllFieldsFromFarm);

	// Create a new field inside a farm from farmid route parameter
	router.post(
		'/farms/:farmid/fields',
		param('farmid').isUUID(),
		body('name').isString(),
		body('size').isNumeric(),
		body('coordinates').isString(),
		validationErrorHandler,
		checkJWT,
		createNewField,
	);

	router.get(
		'/farms/:farmid/fields/:fieldid',
		param('farmid').isUUID(),
		param('fieldid').isUUID(),
		validationErrorHandler,
		checkJWT,
		getField,
	);
};
