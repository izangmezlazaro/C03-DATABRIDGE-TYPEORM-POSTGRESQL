import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantesModule } from './restaurantes/restaurantes.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'databridge_e04',
      autoLoadEntities: true,
      synchronize: true,
    }),
    RestaurantesModule,
  ],
})
export class AppModule {}
