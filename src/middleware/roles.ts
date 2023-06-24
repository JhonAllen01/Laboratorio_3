import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entity/Usuario";

export const checkRoles = (roles: Array<string>) => {
  return async (req: Request, resp: Response, next: NextFunction) => {
    const { cedula } = resp.locals.payload;

    const usuarioRepo = AppDataSource.getRepository(Usuario);
    let usuario: Usuario;
    try {
      usuario = await usuarioRepo.findOne({ where: { id: cedula } });
    } catch (error) {
      resp.status(400).json({ mensaje: "error en roles" });
    }

    if (roles.includes(usuario.rol)) {
      resp.status(400).json({ mensaje: "ACCESO AUTORIZADO" });
      next();
    }
    resp.status(400).json({ mensaje: "ACCESO NO AUTORIZADO" });
  };
};
