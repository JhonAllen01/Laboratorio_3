import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Cliente {
  @PrimaryColumn()
  codigo: number;

  @Column()
  nombre: string;

  @Column()
  apellidos: string;

  @Column()
  direccion: string;

  @Column()
  telefono: number;
}
