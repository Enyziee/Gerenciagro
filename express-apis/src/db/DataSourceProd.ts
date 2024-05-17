import { DataSource } from 'typeorm';

export default new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,

	username: process.env.DB_USERNAME,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,

	entities: ['dist/entity/*.js'], // where our entities reside
	migrations: ['dist/db/migrations/*.js'], // where our migrations reside

	logging: ['error'],
});
