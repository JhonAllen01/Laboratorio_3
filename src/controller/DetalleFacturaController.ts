import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { DetalleFactura } from "../entity/DetalleFactura";
import { Factura } from "../entity/Factura";
import { Producto } from "../entity/Producto";

export class DetalleFacturaController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const detallesRepo = AppDataSource.getRepository(DetalleFactura);
      const listaDetalles = await detallesRepo.find();

      if (listaDetalles.length == 0) {
        return res.status(404).json({ mensaje: "No hay facturas" });
      }

      return res.status(200).json(listaDetalles);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };

  static getById = async (req: Request, res: Response) => {
    try {
      const idDetalleFactura = parseInt(req.params["idDetalleFactura"]);

      if (!idDetalleFactura) {
        return res.status(404).json({ message: "Debe ingresar un id" });
      }

      const detallesRepo = AppDataSource.getRepository(DetalleFactura);
      const detalles = await detallesRepo.findOne({
        where: { idDetalleFactura },
      });

      if (!detalles) {
        return res.status(404).json({ message: "No hay facturas con ese id" });
      }

      return res.status(200).json(detalles);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };

  static add = async (req: Request, res: Response) => {
    //en el postman no sale el campo codigoProducto ni idFactura, pero en la bd si
    try {
      const { idDetalleFactura, idFactura, cantidad, codigoProducto } =
        req.body;

      if (!idDetalleFactura || !idFactura || !cantidad || !codigoProducto) {
        return res
          .status(404)
          .json({ message: "Debe ingresar valores validos" });
      }

      const facturaRepo = AppDataSource.getRepository(Factura);
      const factura = await facturaRepo.find();
      const productosRepo = AppDataSource.getRepository(Producto);
      const producto = await productosRepo.find();

      if (!factura || !producto) {
        return res
          .status(404)
          .json({ message: "No se encuentra la factura o producto" });
      }

      const detallesRepo = AppDataSource.getRepository(DetalleFactura);

      let detalles = new DetalleFactura();
      detalles.idDetalleFactura = idDetalleFactura;
      detalles.factura = idFactura;
      detalles.cantidad = cantidad;
      detalles.producto = codigoProducto;

      try {
        await detallesRepo.save(detalles);
        return res.status(201).json({ message: "Detalle creado exitosamente" });
      } catch (error) {
        return res.status(400).json({ message: "No se pudo guardar" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };

  static update = async (req: Request, res: Response) => {
    try {
      const idDetalleFactura = parseInt(req.params["idDetalleFactura"]);
      const { idFactura, cantidad, codigoProducto } = req.body;

      if (!idDetalleFactura || !idFactura || !cantidad || !codigoProducto) {
        return res
          .status(404)
          .json({ message: "Debe ingresar valores validos" });
      }

      const facturaRepo = AppDataSource.getRepository(Factura);
      const factura = await facturaRepo.find();
      const productosRepo = AppDataSource.getRepository(Producto);
      const producto = await productosRepo.find();
      const detallesRepo = AppDataSource.getRepository(DetalleFactura);
      let detalle: DetalleFactura;

      if (!factura || !producto) {
        return res
          .status(404)
          .json({ message: "No se encuentran la factura o producto" });
      }

      try {
        detalle = await detallesRepo.findOneOrFail({
          where: { idDetalleFactura },
        });
      } catch (error) {
        return res.status(404).json({ message: "No se encontro el detalle" });
      }

      detalle.cantidad = cantidad;
      detalle.factura = idFactura;
      detalle.producto = codigoProducto;

      try {
        await detallesRepo.save(detalle);
        return res.status(200).json({ message: "Detalle actualizado" });
      } catch (error) {
        return res.status(404).json({ message: "No se pudo guardar" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
      const idDetalleFactura = parseInt(req.params["idDetalleFactura"]);

      if (!idDetalleFactura) {
        return res.status(404).json({ massage: "Debe ingresar el id" });
      }

      const detallesRepo = AppDataSource.getRepository(DetalleFactura);
      let detalle;

      try {
        detalle = await detallesRepo.findOneOrFail({
          where: { idDetalleFactura },
        });
      } catch (error) {
        return res.status(400).json({ message: "No se encuentra ese detalle" });
      }

      try {
        await detallesRepo.remove(detalle);
        return res
          .status(200)
          .json({ message: "Detalle eliminado correctamente" });
      } catch (error) {
        return res.status(400).json({ message: "No se pudo eliminar" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };
}

export default DetalleFacturaController;
