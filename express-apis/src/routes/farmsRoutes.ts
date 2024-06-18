import { Router } from 'express';
import { checkJWT } from '../middleware/middlewares';
import { createNewFarm, deleteFarm, showAllFarms, showFarm, updateFarmInfo } from '../controllers/farmController';
import { body, param, query } from 'express-validator';
import { validationErrorHandler } from '../modules/validations';
import {
	createNewField,
	deleteField,
	getAllDefensivesRecords,
	getAllFieldsFromFarm,
	getAllWeatherData,
	getField,
	saveDefensiveRecord,
	updateFieldInfo,
} from '../controllers/fieldController';

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

	router.get(
		'/farms/:farmid/fields/:fieldid/weather',
		param('farmid').isUUID(),
		param('fieldid').isUUID(),
		query('days').optional().isNumeric(),
		validationErrorHandler,
		checkJWT,
		getAllWeatherData,
	);

	router.post(
		'/farms/:farmid/fields/:fieldid/agrodefensives',
		param('farmid').isUUID(),
		param('fieldid').isUUID(),
		body('name').isString(),
		body('volume').isNumeric(),
		validationErrorHandler,
		checkJWT,
		saveDefensiveRecord,
	);

	router.get(
		'/farms/:farmid/fields/:fieldid/agrodefensives',
		param('farmid').isUUID(),
		param('fieldid').isUUID(),
		validationErrorHandler,
		checkJWT,
		getAllDefensivesRecords,
	);

	router.put(
		'/farms/:farmid/fields/:fieldid/',
		param('farmid').isUUID(),
		param('fieldid').isUUID(),

		body('name').optional({values:'falsy'}).isString(),
		body('size').optional({values:'falsy'}).isNumeric(),
		body('coordinates').optional({values:'falsy'}).isString(),

		validationErrorHandler,
		checkJWT,
		updateFieldInfo,
	);

	router.delete(
		'/farms/:farmid/fields/:fieldid/',

		param('farmid').isUUID(),
		param('fieldid').isUUID(),

		validationErrorHandler,
		checkJWT,
		deleteField,
	);

	router.put(
		'/farms/:farmid/',
		param('farmid').isUUID(),

		body('name').optional({values:'falsy'}).isString(),
		body('address').optional({values:'falsy'}).isString(),
		validationErrorHandler,
		checkJWT,
		updateFarmInfo,
	);
	
	router.delete(
		'/farms/:farmid/',
		param('farmid').isUUID(),
		validationErrorHandler,
		checkJWT,
		deleteFarm
	)
};
