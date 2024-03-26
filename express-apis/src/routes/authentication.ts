import express from "express";
import { login, register } from "../controllers/authentication";


export default (router: express.Router) => {
    router.post("/user/create", register);

    router.post("/user/auth", login);

    router.get("/", async (req: express.Request, res: express.Response) => {
        res.send("<h1>Leo Niggee</h1>");
    });
};
