import { DataSource } from 'typeorm';

export default new DataSource({
	type: 'sqlite',
	database: 'mydb.db',
	synchronize: true,

	entities: ['dist/entity/*.js'],
	migrations: ['dist/db/migrations/*.js'],
	logging: true,
});
