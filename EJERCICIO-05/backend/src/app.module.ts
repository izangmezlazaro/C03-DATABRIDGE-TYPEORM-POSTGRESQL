import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViajesModule } from './viajes/viajes.module.js';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'databridge_e05',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ViajesModule,
  ],
})
export class AppModule {}
