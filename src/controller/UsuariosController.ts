import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { validate } from "class-validator";
import { Usuario } from "../entity/Usuario";

export class UsuariosController {
  static getAll = async (req: Request, resp: Response) => {
    try {
      const clientesRepo = AppDataSource.getRepository(Usuario);
      const listaClientes = await clientesRepo.find({
        where: { estado: true },
      });
      if (listaClientes.length == 0) {
        return resp
          .status(404)
          .json({ mensaje: "no se encontro ningun cliente" });
      }
      return resp.status(200).json({ mensaje: listaClientes });
    } catch (error) {
      return resp.status(400).json({ mensaje: error });
    }
  };

  static getById = async (req: Request, resp: Response) => {
    try {
      const id = parseInt(req.params["id"]);
      if (!id) {
        return resp.status(404).json({ mensaje: "no se indica el ID" });
      }
      const clientesRepo = AppDataSource.getRepository(Usuario);
      let usuario;
      try {
        usuario = await clientesRepo.findOneOrFail({
          where: { id: id, estado: true },
        });
      } catch (error) {
        return resp
          .status(404)
          .json({ mensaje: "No hay un cliente con ese ID" });
      }
      return resp.status(200).json({ mensaje: usuario });
    } catch (error) {
      return resp.status(400).json({ mensaje: error });
    }
  };

  static add = async (req: Request, resp: Response) => {
    try {
      const { id, nombre, apellido1, apellido2, correo, contraseña, rol } =
        req.body;

      if (!id) {
        return resp.status(404).json({ mensaje: "debe indicar el id" });
      }
      if (!nombre) {
        return resp.status(404).json({ mensaje: "debe indicar el nombre" });
      }
      if (!apellido1) {
        return resp
          .status(404)
          .json({ mensaje: "debe indicar el primer apellido" });
      }
      if (!apellido2) {
        return resp.status(404).json({ mensaje: "debe indicar el apellido2" });
      }
      if (!correo) {
        return resp.status(404).json({ mensaje: "debe indicar el correo" });
      }
      if (!contraseña) {
        return resp.status(404).json({ mensaje: "debe indicar la contraseña" });
      }
      if (!rol) {
        return resp.status(404).json({ mensaje: "debe indicar el rol" });
      }
      const clientesRepo = AppDataSource.getRepository(Usuario);
      const usu = await clientesRepo.findOne({ where: { id } });

      if (usu) {
        return resp
          .status(404)
          .json({ mensaje: "Ese cliente ya existe en la base de datos" });
      }

      let usuario = new Usuario();

      usuario.id = id;
      usuario.nombre = nombre;
      usuario.apellido1 = apellido1;
      usuario.apellido2 = apellido2;
      usuario.correo = correo;
      usuario.contraseña = contraseña;
      usuario.rol = rol;
      usuario.estado = true;

      usuario.hashPassword;

      try {
        await clientesRepo.save(usuario);
        return resp.status(201).json({ mensaje: "Producto creado" });
      } catch (error) {
        return resp.status(400).json({ mensaje: error });
      }
    } catch (error) {
      return resp.status(400).json({ mensaje: error });
    }
  };

  static update = async (req: Request, resp: Response) => {
    const { id, nombre, apellido1, apellido2, correo, contraseña, rol } =
      req.body;

    if (!id) {
      return resp.status(404).json({ mensaje: "debe indicar el id" });
    }
    if (!nombre) {
      return resp.status(404).json({ mensaje: "debe indicar el nombre" });
    }
    if (!apellido1) {
      return resp
        .status(404)
        .json({ mensaje: "debe indicar el primer apellido" });
    }
    if (!apellido2) {
      return resp.status(404).json({ mensaje: "debe indicar el nombre" });
    }
    if (!correo) {
      return resp.status(404).json({ mensaje: "debe indicar el correo" });
    }
    if (!contraseña) {
      return resp.status(404).json({ mensaje: "debe indicar la contraseña" });
    }
    if (!rol) {
      return resp.status(404).json({ mensaje: "debe indicar el rol" });
    }

    const clientesRepo = AppDataSource.getRepository(Usuario);

    let usu: Usuario;

    try {
      usu = await clientesRepo.findOne({ where: { id } });
    } catch (error) {
      return resp.status(404).json({ mensaje: "No existe ese cliente." });
    }

    usu.nombre = nombre;
    usu.apellido1 = apellido1;
    usu.apellido2 = apellido2;
    usu.correo = correo;
    usu.contraseña = contraseña;
    usu.rol = rol;

    const errors = await validate(Usuario, {
      validationError: { target: false, value: false },
    });

    if (errors.length > 0) {
      return resp.status(400).json(errors);
    }

    try {
      await clientesRepo.save(usu);
      return resp.status(200).json({ mensaje: "Se ha guardado correctamente" });
    } catch (error) {
      return resp
        .status(404)
        .json({ mensaje: "No se ha podido guardar el cliente." });
    }
  };

  static delete = async (req: Request, resp: Response) => {
    try {
      const id = parseInt(req.params["id"]);
      if (!id) {
        return resp.status(404).json({ mensaje: "debe indicar el id" });
      }
      const clientesRepo = AppDataSource.getRepository(Usuario);
      let usu: Usuario;
      try {
        usu = await clientesRepo.findOneOrFail({
          where: { id: id, estado: true },
        });
      } catch (error) {
        return resp
          .status(404)
          .json({ mensaje: "no se encuentra un cliente con ese id" });
      }

      usu.estado = false;
      try {
        await clientesRepo.save(usu);
        return resp.status(200).json({ mensaje: "Se elimino correctamente" });
      } catch (error) {
        return resp
          .status(400)
          .json({ mensaje: "no se elimino correctamente" });
      }
    } catch (error) {
      return resp.status(400).json({ mensaje: "no se pudo eliminar" });
    }
  };
}

export default UsuariosController;
