import { Controller, Get } from '@nestjs/common';
import { Videojuego } from './videojuego.entity.js';
import { VideojuegosService } from './videojuegos.service.js';

// Todas las rutas de esta clase comienzan por /videojuegos.
@Controller('videojuegos')
export class VideojuegosController {
    constructor(
        private readonly videojuegosService: VideojuegosService,
    ) { }

    // Atiende GET /videojuegos.
    // El Controller no consulta PostgreSQL directamente.
    @Get()
    findAll(): Promise<Videojuego[]> {
        return this.videojuegosService.findAll();
    }
}