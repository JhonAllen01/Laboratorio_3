import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entity/Usuario";
import * as jwt from "jsonwebtoken";

export class AuthController {
  static login = async (req: Request, resp: Response) => {
    const { correo, contraseña } = req.body;
    if (!correo || !contraseña) {
      return resp
        .status(400)
        .json({ mensaje: "usuario o contraseña incorrecta" });
    }

    const repoUsuario = AppDataSource.getRepository(Usuario);
    let usu: Usuario;
    try {
      usu = await repoUsuario.findOneOrFail({ where: { correo: correo } });
    } catch (error) {
      return resp
        .status(400)
        .json({ mensaje: "usuario o contraseña incorrecta" });
    }

    if (!usu.checkpassword(contraseña)) {
      return resp
        .status(400)
        .json({ mensaje: "usuario o contraseña incorrecta" });
    }

    const token = jwt.sign({ cedula: usu.id }, "anuel99", {
      expiresIn: "5m",
    });

    return resp.status(200).json({
      token,
      role: usu.rol,
      id: usu.id,
    });
  };
}

export default AuthController;
