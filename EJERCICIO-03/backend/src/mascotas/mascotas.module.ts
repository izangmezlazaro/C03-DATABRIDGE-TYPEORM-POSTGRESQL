// mascotas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mascota } from './mascota.entity.js';
import { MascotasController } from './mascotas.controller.js';
import { MascotasService } from './mascotas.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Mascota])],
  controllers: [MascotasController],
  providers: [MascotasService],
})
export class MascotasModule { }