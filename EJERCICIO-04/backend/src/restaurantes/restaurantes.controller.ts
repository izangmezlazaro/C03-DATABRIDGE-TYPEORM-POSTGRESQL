// restaurantes.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { CreateRestauranteDto } from './create-restaurante.dto.js';
import { Restaurante } from './restaurante.entity.js';
import { RestaurantesService } from './restaurantes.service.js';

@Controller('restaurantes')
export class RestaurantesController {
  constructor(private readonly service: RestaurantesService) {}

  @Post()
  create(@Body() dto: CreateRestauranteDto): Promise<Restaurante> {
    return this.service.create(dto);
  }
}
