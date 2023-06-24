import { Router } from "express";
import ProveedorController from "../controller/ProveedorController";

const routes = Router();

routes.get("/:codigo", ProveedorController.getById);
routes.post("/", ProveedorController.add);
routes.patch("/:codigo", ProveedorController.update);
routes.delete("/:codigo", ProveedorController.delete);

export default routes;
