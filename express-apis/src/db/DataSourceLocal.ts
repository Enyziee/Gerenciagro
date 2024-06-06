import { DataSource } from 'typeorm';

export default new DataSource({
	type: 'postgres',
	// host: '45.55.75.110',
	host: 'localhost',
	port: 5432,

	// Insira os dados de seu banco de dados local
	username: 'postgres',
	database: 'postgres',
	password: 'y49Ewznf2Gtje',

	entities: ['dist/entity/*.js'],
	migrations: ['dist/db/migrations/*.js'],

	logging: true,
});
