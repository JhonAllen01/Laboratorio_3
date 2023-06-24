import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Proveedor } from "./Proveedor";

@Entity()
export class Producto {
  @PrimaryColumn()
  codigo: number;

  @Column()
  descripcion: string;

  @Column()
  precio: number;

  @Column()
  stockMaximo: number;

  @Column()
  stockMinimo: number;

  @ManyToMany(() => Proveedor, { cascade: true })
  @JoinColumn({ name: "codigoProveedor", referencedColumnName: "codigo" })
  proveedor: Proveedor;
}
