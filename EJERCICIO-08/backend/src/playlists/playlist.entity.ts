import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import { Cancion } from './cancion.entity.js';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn() id: number;
  @Column() nombre: string;

  // Una Playlist puede contener muchas Canciones.
  @OneToMany(() => Cancion, (cancion) => cancion.playlist)
  canciones: Relation<Cancion[]>;
}