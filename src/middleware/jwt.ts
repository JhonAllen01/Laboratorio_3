import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export const checkjwt = (req: Request, resp: Response, next: NextFunction) => {
  const token = <string>req.headers["token"];

  if (!token) {
    resp.status(403).json("acceso no autorizado");
  }
  let payload;
  try {
    payload = jwt.verify(token, "anuel99");
    resp.locals.payload = payload;
  } catch (error) {
    resp.status(403).json("acceso no autorizado");
  }
  const { cedula } = payload;
  const tokenNew = jwt.sign(cedula, "anuel99", { expiresIn: "5m" });
  resp.setHeader("token", tokenNew);
  next();
};
