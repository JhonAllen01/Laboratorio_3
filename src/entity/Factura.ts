import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Cliente } from "./Cliente";
import { Vendedor } from "./Vendedor";

@Entity()
export class Factura {
  @PrimaryGeneratedColumn()
  idFactura: number;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  fecha: Date;

  @ManyToOne(() => Cliente, { cascade: true })
  @JoinColumn({ name: "codigoCliente", referencedColumnName: "codigo" })
  cliente: Cliente;

  @ManyToOne(() => Vendedor, { cascade: true })
  @JoinColumn({ name: "codigoVendedor", referencedColumnName: "codigo" })
  vendedor: Vendedor;

  @Column()
  estado: boolean;
}
