export const JWT_SECRET = process.env.JWT_SECRET!
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION!

export const DB_HOST = process.env.DB_HOST!
export const DB_PORT = process.env.DB_PORT ? +process.env.DB_PORT : 5432
export const DB_DATABASE = process.env.DB_DATABASE!
export const DB_USERNAME = process.env.DB_USERNAME!
export const DB_PASSWORD = process.env.DB_PASSWORD!

export const EXPRESS_PORT = process.env.EXPRESS_PORT ? +process.env.EXPRESS_PORT: 3000