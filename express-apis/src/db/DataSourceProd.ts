import { DataSource } from 'typeorm';
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME } from '../config';

export default new DataSource({
	type: 'postgres',
	host: DB_HOST,
	port: DB_PORT,

	username: DB_USERNAME,
	database: DB_DATABASE,
	password: DB_PASSWORD,

	entities: ['dist/entity/*.js'], // where our entities reside
	migrations: ['dist/db/migrations/*.js'], // where our migrations reside

	logging: ['error'],
});
