import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Proveedor } from "../entity/Proveedor";

export class ProveedorController {
  static getById = async (req: Request, res: Response) => {
    try {
      const codigo = parseInt(req.params["codigo"]);

      if (!codigo) {
        return res.status(404).json({ mensaje: "No se encontro el proveedor" });
      }

      const proveedores = AppDataSource.getRepository(Proveedor);
      let proveedor;

      try {
        proveedor = await proveedores.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(404).json({ mensaje: "No se encontro el proveedor" });
      }

      return res.status(200).json(proveedor);
    } catch (error) {
      return res.status(400).json({ mensaje: error });
    }
  };

  static add = async (req: Request, res: Response) => {
    const { codigo, nombre, apellidos, direccion, provincia, telefono } =
      req.body;

    if (
      !codigo ||
      !nombre ||
      !apellidos ||
      !direccion ||
      !provincia ||
      !telefono
    ) {
      return res.status(404).json({ mensaje: "Debe ingresar un valor" });
    }

    const proveedores = AppDataSource.getRepository(Proveedor);
    const buscar = await proveedores.findOne({ where: { codigo } });

    if (buscar) {
      return res.status(404).json({ mensaje: "Proveedor existente" });
    }

    let proveedor = new Proveedor();
    proveedor.codigo = codigo;
    proveedor.nombre = nombre;
    proveedor.apellidos = apellidos;
    proveedor.direccion = direccion;
    proveedor.provincia = provincia;
    proveedor.telefono = telefono;

    await proveedores.save(proveedor);
    return res.status(201).json({ mensaje: "Proveedor insertado" });
  };

  static update = async (req: Request, res: Response) => {
    try {
      const codigo = parseInt(req.params["codigo"]);
      const { nombre, apellidos, direccion, provincia, telefono } = req.body;

      if (!codigo || !apellidos || !direccion || !provincia || !telefono) {
        return res
          .status(404)
          .json({ message: "Debe ingresar valores validos" });
      }

      const proveedorRepo = AppDataSource.getRepository(Proveedor);
      let proveedor: Proveedor;

      try {
        proveedor = await proveedorRepo.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(404).json({ message: "No se encontro el proveedor" });
      }

      proveedor.nombre = nombre;
      proveedor.apellidos = apellidos;
      proveedor.direccion = direccion;
      proveedor.provincia = provincia;
      proveedor.telefono = telefono;

      try {
        await proveedorRepo.save(proveedor);
        return res.status(200).json({ message: "Actualizado correctamente" });
      } catch (error) {
        return res
          .status(404)
          .json({ message: "No se pudo actualizar el proveedor" });
      }
    } catch (error) {
      return res.status(400).json({ mensaje: error });
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
      const codigo = parseInt(req.params["codigo"]);

      if (!codigo) {
        return res.status(404).json({ message: "Debe ingresar un codigo" });
      }

      const proveedorRepo = AppDataSource.getRepository(Proveedor);
      let proveedor: Proveedor;

      try {
        proveedor = await proveedorRepo.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(404).json({ message: "No se encontro el proveedor" });
      }

      try {
        await proveedorRepo.remove(proveedor);
        await proveedorRepo.save(proveedor);
        return res.status(404).json({ message: "Eliminado correctamente" });
      } catch (error) {
        return res
          .status(404)
          .json({ message: "No se pudo eliminar el proveedor" });
      }
    } catch (error) {
      return res.status(400).json({ mensaje: error });
    }
  };
}

export default ProveedorController;
