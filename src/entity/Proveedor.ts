import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Proveedor {
  @PrimaryColumn()
  codigo: number;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column()
  direccion: string;

  @Column()
  provincia: string;

  @Column()
  telefono: number;
}
