import { DataSource } from 'typeorm';

export default new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,

	// Insira os dados de seu banco de dados local
	username: '',
	database: '',
	password: '',

	entities: ['dist/entity/*.js'],
	migrations: ['dist/db/migrations/*.js'],

	logging: true,
});
