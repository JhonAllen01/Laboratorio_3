import { Router } from "express";
import { AuthController } from "../controller/AuthController";

const routes = Router();

routes.post("/Login", AuthController.login);

export default routes;
