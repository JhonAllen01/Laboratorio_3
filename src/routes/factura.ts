import { Router } from "express";
import { FacturaController } from "../controller/FacturaController";

const routes = Router();

routes.get("/", FacturaController.getAll);
routes.get("/:idFactura", FacturaController.getById);
routes.post("/", FacturaController.add);
routes.patch("/:idFactura", FacturaController.update);
routes.delete("/:idFactura", FacturaController.delete);

export default routes;
