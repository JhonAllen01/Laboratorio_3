import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Factura } from "./Factura";
import { Producto } from "./Producto";

@Entity()
export class DetalleFactura {
  @PrimaryGeneratedColumn()
  idDetalleFactura: number;

  @OneToOne(() => Factura, { cascade: true })
  @JoinColumn({ name: "idFactura", referencedColumnName: "idFactura" })
  factura: Factura;

  @Column()
  cantidad: number;

  @ManyToOne(() => Producto, { cascade: true })
  @JoinColumn({ name: "codigoProducto", referencedColumnName: "codigo" })
  producto: Producto;
}
