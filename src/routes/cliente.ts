import { Router } from "express";
import ClientesController from "../controller/ClientesController";

const routes = Router();

routes.get("/:codigo", ClientesController.getById);
routes.post("/", ClientesController.add);
routes.patch("/:codigo", ClientesController.update);
routes.delete("/:codigo", ClientesController.delete);

export default routes;
