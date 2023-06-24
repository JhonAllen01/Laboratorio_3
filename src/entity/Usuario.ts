import { Column, Entity, PrimaryColumn, Unique } from "typeorm";
import * as bcrypt from "bcryptjs";

@Entity()
export class Usuario {
  @PrimaryColumn()
  id: number;
  @Column()
  nombre: string;
  @Column()
  apellido1: string;
  @Column()
  apellido2: string;
  @Column({ unique: true })
  correo: string;
  @Column()
  contraseña: string;
  @Column()
  rol: string;
  @Column()
  estado: boolean;

  //encriptar contraseñas
  hashPassword(): void {
    const salt = bcrypt.genSaltSync(10);
    this.contraseña = bcrypt.hashSync(this.contraseña, salt);
  }

  //compara si las contraseñas son iguales
  checkpassword(contra: string): boolean {
    return bcrypt.compareSync(contra, this.contraseña);
  }
}
