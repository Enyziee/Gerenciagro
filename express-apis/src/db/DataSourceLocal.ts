import { DataSource } from 'typeorm';

export default new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5436,

	// Insira os dados de seu banco de dados local
	username: 'test',
	database: 'testing',
	password: 'root',

	entities: ['dist/entity/*.js'],
	migrations: ['dist/db/migrations/*.js'],

	logging: true,
});
