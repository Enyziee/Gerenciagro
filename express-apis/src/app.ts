import http from "node:http";
import { json } from 'body-parser';
import express from 'express';
import db from "./db";
import routes from './routes';

const PORT = process.env.EXPRESS_PORT;
const app = express();

app.use(json());
app.use("/", routes());

http.createServer(app).listen(PORT, async () => {

    const conn = await db.connect();
    conn.release();

    console.log(`Server listening on http://localhost:${PORT}`);
});
