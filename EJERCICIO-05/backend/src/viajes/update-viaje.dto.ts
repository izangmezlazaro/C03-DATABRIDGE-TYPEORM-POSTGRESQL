// Todas las propiedades son opcionales porque PATCH modifica solo una parte.
export class UpdateViajeDto {
  destino?: string;
  pais?: string;
  estado?: string;
  fecha?: string;
}