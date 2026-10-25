// peliculas.controller.ts
// RESPONSABILIDAD: exponer GET /peliculas.
import { Controller, Get } from '@nestjs/common';
import { Pelicula } from './pelicula.entity.js';
import { PeliculasService } from './peliculas.service.js';

@Controller('peliculas')
export class PeliculasController {
  constructor(private readonly service: PeliculasService) {}

  @Get()
  findAll(): Promise<Pelicula[]> {
    return this.service.findAll();
  }
}

