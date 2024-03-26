import db from "../db/index";

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

    private constructor() { }


    public static async save(entity: User): Promise<boolean> {
        const query = {
            text: "INSERT INTO Users (id, email, name, password) VALUES ($1, $2, $3, $4)",
            values: [entity.id, entity.email, entity.name, entity.password],
        };

        const result = await db.query(query);
        console.log(result);

        return true;
    }


    public static async findByEmail(email: string): Promise<User> {
        const query = {
            text: "SELECT * FROM Users WHERE email = $1",
            values: [email],
        };

        const result = await db.query(query);
        return result.rows[0];
    }
}
