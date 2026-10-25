import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './playlist.entity.js';
import { Cancion } from './cancion.entity.js';
import { CreateCancionDto } from './create-cancion.dto.js';

@Injectable()
export class PlaylistsService implements OnModuleInit {
  constructor(
    @InjectRepository(Playlist) private readonly playlists: Repository<Playlist>,
    @InjectRepository(Cancion) private readonly canciones: Repository<Cancion>,
  ) {}

  async onModuleInit() {
    if ((await this.playlists.count()) === 0) {
      const playlist = await this.playlists.save(
        this.playlists.create({ nombre: 'Entrenamiento' }),
      );
      await this.canciones.save(
        this.canciones.create({
          titulo: 'Run Boy Run',
          artista: 'Woodkid',
          playlist,
        }),
      );
    }
  }

  async findOne(id: number): Promise<Playlist> {
    const playlist = await this.playlists.findOne({
      where: { id },
      relations: { canciones: true },
    });
    if (!playlist) throw new NotFoundException('Playlist no encontrada');
    return playlist;
  }

  async addCancion(dto: CreateCancionDto): Promise<Playlist> {
    // 2. Busca primero la Playlist antes de crear la Canción
    const playlist = await this.playlists.findOne({
      where: { id: dto.playlistId },
    });
    if (!playlist) throw new NotFoundException('Playlist no encontrada');

    // 3. Guarda la Canción relacionada con su Playlist
    await this.canciones.save(
      this.canciones.create({
        titulo: dto.titulo,
        artista: dto.artista,
        playlist,
      }),
    );

    // Vuelve a consultar la playlist con relations
    return this.findOne(dto.playlistId);
  }
}