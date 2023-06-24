import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Producto } from "../entity/Producto";
import { Proveedor } from "../entity/Proveedor";

export class ProductosController {
  static getById = async (req: Request, res: Response) => {
    try {
      const codigo = parseInt(req.params["codigo"]);

      if (!codigo) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
      }

      const clientes = AppDataSource.getRepository(Producto);
      let producto;

      try {
        producto = await clientes.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(404).json({ mensaje: "No se encontro el producto" });
      }

      return res.status(200).json(producto);
    } catch (error) {
      return res.status(400).json({ mensaje: error });
    }
  };

  static add = async (req: Request, res: Response) => {
    const {
      codigo,
      descripcion,
      precio,
      stockMaximo,
      stockMinimo,
      codigoProveedor,
    } = req.body;

    if (
      !codigo ||
      !descripcion ||
      !precio ||
      !stockMaximo ||
      !stockMinimo ||
      precio < 0 ||
      stockMaximo < 0 ||
      stockMinimo < 0 ||
      !codigoProveedor
    ) {
      return res.status(404).json({ mensaje: "Debe ingresar un valor valido" });
    }
    const proveedorRepo = AppDataSource.getRepository(Proveedor);
    const proveedor = await proveedorRepo.find();

    if (!proveedor) {
      return res.status(404).json({ message: "Proveedor inexistente" });
    }

    const productos = AppDataSource.getRepository(Producto);
    const buscar = await productos.findOne({ where: { codigo } });

    if (buscar) {
      return res.status(404).json({ mensaje: "Producto existente" });
    }

    let producto = new Producto();
    producto.codigo = codigo;
    producto.descripcion = descripcion;
    producto.precio = precio;
    producto.stockMaximo = stockMaximo;
    producto.stockMinimo = stockMinimo;
    producto.proveedor = codigoProveedor;

    try {
      await productos.save(producto);
      return res.status(201).json({ mensaje: "Producto insertado" });
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  };

  static update = async (req: Request, res: Response) => {
    try {
      const codigo = parseInt(req.params["codigo"]);
      const { descripcion, precio, stockMaximo, stockMinimo, codigoProveedor } =
        req.body;

      if (
        !codigo ||
        !descripcion ||
        !stockMaximo ||
        !stockMinimo ||
        !codigoProveedor
      ) {
        return res
          .status(404)
          .json({ mensaje: "Debe ingresar valores validos" });
      }

      const productRepo = AppDataSource.getRepository(Producto);
      let producto: Producto;

      try {
        producto = await productRepo.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(404).json({ mensaje: "No se encontro el producto" });
      }

      producto.descripcion = descripcion;
      producto.precio = precio;
      producto.stockMaximo = stockMaximo;
      producto.stockMinimo = stockMinimo;
      producto.proveedor = codigoProveedor;

      try {
        await productRepo.save(producto);
        return res
          .status(200)
          .json({ mensaje: "Producto actualizado correctamente" });
      } catch (error) {
        return res.status(404).json({ mensaje: "No se pudo actualizar" });
      }
    } catch (error) {
      return res.status(400).json({ mensaje: error });
    }
  };

  static delete = async (req: Request, res: Response) => {
    try {
      const codigo = parseInt(req.params["codigo"]);

      if (!codigo) {
        return res.status(404).json({ mensaje: "Debe ingresar un codigo" });
      }

      const productRepo = AppDataSource.getRepository(Producto);
      let producto: Producto;

      try {
        producto = await productRepo.findOneOrFail({ where: { codigo } });
      } catch (error) {
        return res.status(404).json({ mensaje: "No se encontro el producto" });
      }

      try {
        await productRepo.delete(producto);
        return res
          .status(200)
          .json({ mensaje: "Producto eliminado correctamente" });
      } catch (error) {
        return res
          .status(404)
          .json({ mensaje: "No se pudo eliminar el producto" });
      }
    } catch (error) {
      return res.status(400).json({ mensaje: error });
    }
  };
}

export default ProductosController;
