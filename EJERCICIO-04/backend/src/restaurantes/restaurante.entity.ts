// restaurante.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('restaurantes')
export class Restaurante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  tipo: string;

  @Column()
  ciudad: string;

  @Column('decimal', { precision: 3, scale: 1, default: 0 })
  puntuacion: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  precioMedio: number;
}
