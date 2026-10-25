import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Playlist } from './playlist.entity.js';

@Entity('canciones')
export class Cancion {
  @PrimaryGeneratedColumn() id: number;
  @Column() titulo: string;
  @Column() artista: string;

  // ManyToOne es el lado que almacena la clave foránea.
  @ManyToOne(() => Playlist, (playlist) => playlist.canciones, { onDelete: 'CASCADE' })
  playlist: Relation<Playlist>;
}