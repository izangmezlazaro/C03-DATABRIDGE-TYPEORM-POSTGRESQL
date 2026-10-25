// viajes.service.ts
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateViajeDto } from './update-viaje.dto.js';
import { Viaje } from './viaje.entity.js';

@Injectable()
export class ViajesService implements OnModuleInit {
  constructor(
    @InjectRepository(Viaje)
    private readonly repository: Repository<Viaje>,
  ) {}

  async onModuleInit() {
    if ((await this.repository.count()) === 0) {
      await this.repository.save(
        this.repository.create({
          destino: 'Tokio',
          pais: 'Japón',
          estado: 'RESERVADO',
          fecha: '10/04/2027',
        }),
      );
    }
  }

  async findOne(id: number): Promise<Viaje> {
    const viaje = await this.repository.findOneBy({ id });
    if (!viaje) {
      throw new NotFoundException(`Viaje #${id} no encontrado`);
    }
    return viaje;
  }

  async update(id: number, dto: UpdateViajeDto): Promise<Viaje> {
    // Buscamos el recurso existente
    const viaje = await this.findOne(id);

    // merge solo sobrescribe las propiedades presentes en el dto (PATCH parcial)
    this.repository.merge(viaje, dto);

    // Persistimos en PostgreSQL
    return this.repository.save(viaje);
  }
}
