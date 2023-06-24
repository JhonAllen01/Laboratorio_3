import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Vendedor } from "../entity/Vendedor";

export class VendedorController {
  static getById = async (req: Request, res: Response) => {
    try {
      const codigo = parseInt(req.params["codigo"]);

      if (!codigo) {
        return res.status(404).json({ mensaje: "Vendedor no encontrado" });
      }

      const vendedores = AppDataSource.getRepository(Vendedor);
      let vendedor;

      try {
        vendedor = await vendedores.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(404).json({ mensaje: "Vendedor no encontrado" });
      }

      return res.status(200).json(vendedor);
    } catch (error) {
      return res.status(400).json({ mensaje: error });
    }
  };

  static add = async (req: Request, res: Response) => {
    const { codigo, nombre, apellidos, direccion, telefono } = req.body;

    if (!codigo || !nombre || !apellidos || !direccion || !telefono) {
      return res.status(404).json({ mensaje: "Ingrese un valor valido" });
    }

    const vendedores = AppDataSource.getRepository(Vendedor);
    const buscar = await vendedores.findOne({ where: { codigo } });

    if (buscar) {
      return res.status(404).json({ mensaje: "Vendedor existente" });
    }

    let vendedor = new Vendedor();
    vendedor.codigo = codigo;
    vendedor.nombre = nombre;
    vendedor.apellidos = apellidos;
    vendedor.direccion = direccion;
    vendedor.telefono = telefono;

    await vendedores.save(vendedor);
    return res.status(201).json({ mensaje: "Vendedor insertado" });
  };

  static update = async (req: Request, res: Response) => {
    try {
      const codigo = parseInt(req.params["codigo"]);
      const { nombre, apellidos, direccion, telefono } = req.body;

      if (!codigo || !nombre || !apellidos || !direccion || !telefono) {
        return res.status(404).json({ message: "Debe ingresar un codigo" });
      }

      const vendedorRepo = AppDataSource.getRepository(Vendedor);
      let vendedor: Vendedor;

      try {
        vendedor = await vendedorRepo.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(404).json({ message: "Vendedor no encontrado" });
      }

      vendedor.nombre = nombre;
      vendedor.apellidos = apellidos;
      vendedor.direccion = direccion;
      vendedor.telefono = telefono;

      try {
        await vendedorRepo.save(vendedor);
        return res
          .status(404)
          .json({ message: "Vendedor actualizado correctamente" });
      } catch (error) {
        return res.status(404).json({ message: "No se pudo actualizar" });
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

      const vendedorRepo = AppDataSource.getRepository(Vendedor);
      let vendedor: Vendedor;

      try {
        vendedor = await vendedorRepo.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(404).json({ message: "No se encontro el vendedor" });
      }

      try {
        await vendedorRepo.remove(vendedor);
        return res.status(404).json({ message: "Eliminado correctamente" });
      } catch (error) {
        return res.status(404).json({ message: "No se pudo eliminar" });
      }
    } catch (error) {
      return res.status(400).json({ mensaje: error });
    }
  };
}

export default VendedorController;
