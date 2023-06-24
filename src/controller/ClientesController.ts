import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cliente } from "../entity/Cliente";
import { getRepository } from "typeorm";

export class ClientesController {
  static getById = async (req: Request, res: Response) => {
    try {
      const codigo = parseInt(req.params["codigo"]);

      if (!codigo) {
        return res.status(404).json({ mensaje: "Cliente no encontrado" });
      }

      const clientes = AppDataSource.getRepository(Cliente);
      let cliente;

      try {
        cliente = await clientes.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(404).json({ mensaje: "No se encontro el codigo" });
      }

      return res.status(200).json(cliente);
    } catch (error) {
      return res.status(400).json({ mensaje: error });
    }
  };

  static add = async (req: Request, res: Response) => {
    const { codigo, nombre, apellidos, direccion, telefono } = req.body;

    if (!codigo) {
      return res.status(404).json({ mensaje: "Debe insertar el codigo" });
    }
    if (!nombre) {
      return res.status(404).json({ mensaje: "Debe insertar el nombre" });
    }
    if (!apellidos) {
      return res.status(404).json({ mensaje: "Debe insertar los apellidos" });
    }
    if (!direccion) {
      return res.status(404).json({ mensaje: "Debe insertar la direccion" });
    }
    if (!telefono) {
      return res.status(404).json({ mensaje: "Debe insertar el numero" });
    }

    const clientes = AppDataSource.getRepository(Cliente);
    const buscar = await clientes.findOne({ where: { codigo } });

    if (buscar) {
      return res.status(404).json({ mensaje: "Cliente existente" });
    }

    let cliente = new Cliente();
    cliente.codigo = codigo;
    cliente.nombre = nombre;
    cliente.apellidos = apellidos;
    cliente.direccion = direccion;
    cliente.telefono = telefono;

    await clientes.save(cliente);
    return res.status(201).json({ mensaje: "Cliente insertado" });
  };

  static update = async (req: Request, res: Response) => {
    try {
      const codigo = parseInt(req.params["codigo"]);
      const { nombre, apellidos, direccion, telefono } = req.body;

      if (!nombre || !apellidos || !direccion || !telefono || !codigo) {
        return res.status(404).json({ mensaje: "Debe ingresar datos validos" });
      }

      const clienteRepo = AppDataSource.getRepository(Cliente);
      let cliente: Cliente;

      try {
        cliente = await clienteRepo.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(400).json({ mensaje: "No existe ese cliente" });
      }

      cliente.nombre = nombre;
      cliente.apellidos = apellidos;
      cliente.direccion = direccion;
      cliente.telefono = telefono;

      try {
        await clienteRepo.save(cliente);
        return res
          .status(201)
          .json({ mensaje: "Cliente actualizado correctamente" });
      } catch (error) {
        return res
          .status(404)
          .json({ mensaje: "No se pudo modificar el cliente" });
      }
    } catch (error) {
      return res.status(400).json({ mensaje: error });
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
      const codigo = parseInt(req.params["codigo"]);

      if (!codigo) {
        return res
          .status(404)
          .json({ mensaje: "Debe indicar el codigo del cliente" });
      }

      const clienteRepo = AppDataSource.getRepository(Cliente);
      let cliente: Cliente;

      try {
        cliente = await clienteRepo.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(404).json({ mensaje: "No se encontro el cliente" });
      }

      try {
        await clienteRepo.remove(cliente);
        return res
          .status(200)
          .json({ mensaje: "Cliente eliminado correctamente" });
      } catch (error) {
        return res
          .status(404)
          .json({ mensaje: "No se pudo eliminar el cliente" });
      }
    } catch (error) {
      return res.status(400).json({ mensaje: error });
    }
  };
}

export default ClientesController;
