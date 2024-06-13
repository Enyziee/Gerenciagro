import { DataSource } from 'typeorm';

export default new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,

	// Insira os dados de seu banco de dados local
	username: 'postgres',
	database: 'postgres',
	password: 'y49Ewznf2Gtje',
	entities: ['dist/entity/*.js'],
	useUTC: true,
	migrations: ['dist/db/migrations/*.js'],
	logging: true,
});
