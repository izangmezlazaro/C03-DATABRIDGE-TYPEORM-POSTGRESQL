// create-restaurante.dto.ts
export class CreateRestauranteDto {
  nombre: string;
  tipo: string;
  ciudad: string;
  puntuacion?: number;
  precioMedio: number;
}
