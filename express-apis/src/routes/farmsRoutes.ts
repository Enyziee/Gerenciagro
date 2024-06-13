import { Router } from 'express';
import { checkJWT } from '../middleware/middlewares';
import { createNewFarm, showAllFarms, showFarm } from '../controllers/farmController';
import { body, param } from 'express-validator';
import { validationErrorHandler } from '../modules/validations';
import { climateData, createNewField, getAllFieldsFromFarm, getField, saveDefensiveRecord } from '../controllers/fieldController';

export default (router: Router) => {
	// Only farms endpoints

	// Return all farms from a authenticated user
	router.get('/farms', checkJWT, showAllFarms);

	// Return only the farm that matchs the ID passed by route paramater
	router.get('/farms/:farmid', param('farmid').isUUID(), validationErrorHandler, checkJWT, showFarm);

	router.get('/farms/:farmid/fields', param('farmid').isUUID(), validationErrorHandler, checkJWT, getAllFieldsFromFarm);

	router.get(
		'/farms/:farmid/fields/:fieldid',
		param('farmid').isUUID(),
		param('fieldid').isUUID(),
		validationErrorHandler,
		checkJWT,
		getField,
	);

	// Create a new farm for the authenticated user
	router.post(
		'/farms',
		body('name').exists().isString(),
		body('address').exists().isString(),
		validationErrorHandler,
		checkJWT,
		createNewFarm,
	);

	// Create a new field inside a farm from farmid route parameter
	router.post(
		'/farms/:farmid/fields',
		param('farmid').exists().isUUID(),
		body('name').exists().isString(),
		body('size').exists().isNumeric(),
		body('coordinates').exists().isString(),
		validationErrorHandler,
		checkJWT,
		createNewField,
	);

	router.post(
		'/farms/:farmid/fields/:fieldid/fetchclimate',
		param('farmid').isUUID(),
		param('fieldid').isUUID(),
		body('days').isNumeric(),
		validationErrorHandler,
		checkJWT,
		climateData,
	);
	
	router.post(
		'/farms/:farmid/fields/:fieldid/agrodefensives',
		param('farmid').isUUID(),
		param('fieldid').isUUID(),
		body('name').exists().isString(),
		body('volume').exists().isNumeric(),
		validationErrorHandler,
		checkJWT,
		saveDefensiveRecord
	);
};
