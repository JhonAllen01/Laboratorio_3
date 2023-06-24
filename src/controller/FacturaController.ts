import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Factura } from "../entity/Factura";
import { Vendedor } from "../entity/Vendedor";
import { Cliente } from "../entity/Cliente";

export class FacturaController {
  static getAll = async (req: Request, res: Response) => {
    try {
      const facturas = AppDataSource.getRepository(Factura);
      const listaFacturas = await facturas.find({ where: { estado: true } });

      if (listaFacturas.length == 0) {
        return res.status(404).json({ mensaje: "No se encontraron facturas" });
      }

      return res.status(200).json({ listaFacturas });
    } catch (error) {
      return res.status(400).json({ error });
    }
  };

  static getById = async (req: Request, res: Response) => {
    try {
      const idFactura = parseInt(req.params["idFactura"]);

      if (!idFactura) {
        return res.status(404).json({ message: "No encontrada" });
      }

      const facturaRepo = AppDataSource.getRepository(Factura);
      let factura;

      try {
        factura = await facturaRepo.findOneOrFail({ where: { idFactura } });
      } catch (error) {
        return res.status(404).json({ message: "No encontrado" });
      }

      return res.status(200).json(factura);
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  };

  static add = async (req: Request, res: Response) => {
    //en el postman no salen los campos codigoCliente ni codigoVendedor, pero en la bd si
    try {
      const { idFactura, fecha, codigoCliente, codigoVendedor, estado } =
        req.body;
      const { codigo } = req.body;

      const clienteRepo = AppDataSource.getRepository(Cliente);
      let cliente;
      const vendedorRepo = AppDataSource.getRepository(Vendedor);
      let vendedor;
      const facturaRepo = AppDataSource.getRepository(Factura);
      let factura: Factura;

      try {
        cliente = await clienteRepo.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(400).json({ message: "Cliente existente" });
      }
      //arreglar estos trycacth
      try {
        vendedor = await vendedorRepo.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(400).json({ message: "Vendedor existente" });
      }

      let nuevaFactura = new Factura();
      nuevaFactura.idFactura = idFactura;
      nuevaFactura.fecha = fecha;
      nuevaFactura.cliente = codigoCliente;
      nuevaFactura.vendedor = codigoVendedor;
      nuevaFactura.estado = true;

      try {
        await facturaRepo.save(nuevaFactura);
        return res.status(201).json({ message: "Factura insertada" });
      } catch (error) {
        return res
          .status(201)
          .json({ message: "No se pudo insertar la factura" });
      }
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };

  static update = async (req: Request, res: Response) => {
    try {
      const idFactura = parseInt(req.params["idFactura"]);
      const { fecha, codigoCliente, codigoVendedor } = req.body;

      if (!idFactura || !codigoCliente || !codigoVendedor) {
        return res.status(404).json({ message: "Ingrese valores validos" });
      }

      const facturaRepo = AppDataSource.getRepository(Factura);
      let factura: Factura;

      try {
        factura = await facturaRepo.findOneOrFail({ where: { idFactura } });
      } catch (error) {
        return res.status(404).json({ message: "Factura no encontrada" });
      }

      factura.fecha = fecha;
      factura.cliente = codigoCliente;
      factura.vendedor = codigoVendedor;

      try {
        await facturaRepo.save(factura);
        return res.status(200).json({ message: "Factura modificada" });
      } catch (error) {
        return res.status(404).json({ message: "No se pudo modificar" });
      }
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
      const idFactura = parseInt(req.params["idFactura"]);

      if (!idFactura) {
        return res.status(404).json({ message: "Ingrese el id de la fcatura" });
      }

      const facturaRepo = AppDataSource.getRepository(Factura);
      let factura;

      try {
        factura = await facturaRepo.findOneOrFail({ where: { idFactura } });
      } catch (error) {
        return res.status(404).json({ message: "Ingrese un id valido" });
      }

      try {
        await facturaRepo.remove(factura);
        return res
          .status(200)
          .json({ message: "Factura eliminada correctamente" });
      } catch (error) {
        return res.status(404).json({ message: "No se pudo eliminar" });
      }
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  };
}

export default FacturaController;
