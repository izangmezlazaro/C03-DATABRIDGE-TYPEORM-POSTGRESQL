import { Controller, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { Libro } from './libro.entity.js';
import { LibrosService } from './libros.service.js';

@Controller('libros')
export class LibrosController {
  constructor(private readonly service: LibrosService) {}

  @Get()
  findAll(): Promise<Libro[]> {
    return this.service.findAll();
  }

  @Patch(':id')
  marcarLeido(@Param('id', ParseIntPipe) id: number): Promise<Libro> {
    return this.service.marcarLeido(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}
