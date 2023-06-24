import { Router } from "express";
import ProductoController from "../controller/ProductosController";

const routes = Router();

routes.get("/:codigo", ProductoController.getById);
routes.post("/", ProductoController.add);
routes.patch("/:codigo", ProductoController.update);
routes.delete("/:codigo", ProductoController.delete);

export default routes;
