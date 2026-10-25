import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('videojuegos')
export class Videojuego {
    @PrimaryGeneratedColumn()
    id: number;

    // Cada @Column representa una columna de la tabla.
    @Column()
    titulo: string;

    @Column({ default: '' })
    genero: string;

    @Column()
    plataforma: string;

    // precision 3 + scale 1 permite valores como 9.4 o 10.0.
    @Column('decimal', { precision: 3, scale: 1 })
    puntuacion: number;
}