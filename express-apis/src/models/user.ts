import db from '../db/index';

export class User {
	public id: string;
	public name: string;
	public email: string;
	public password: string;

	public constructor(id: string, name: string, email: string, password: string) {
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
	}
}

export class UserRepository {
	private constructor() {}

	public static async create(entity: User): Promise<boolean> {
		const query = {
			text: 'INSERT INTO Users (id, email, name, password) VALUES ($1, $2, $3, $4)',
			values: [entity.id, entity.email, entity.name, entity.password],
		};

		await db.query(query);

		return true;
	}

	public static async findByEmail(email: string): Promise<User> {
		const query = {
			text: 'SELECT * FROM Users WHERE email = $1',
			values: [email],
		};

		const result = await db.query(query);
		return new User(result.rows[0].id, result.rows[0].name, result.rows[0].email, result.rows[0].password);
	}

	public static async findAll(): Promise<Array<User>> {
		const query = {
			text: 'SELECT * FROM Users',
		};

		const results = await db.query(query);

		const users = new Array<User>();

		results.rows.forEach((row) => {
			const user = new User(row.id, row.name, row.email, '');
			users.push(user);
		});

		return users;
	}
}
