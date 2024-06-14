import { DataSource } from 'typeorm';

export default new DataSource({
	type: 'sqlite',
	database: ':memory:',
});
