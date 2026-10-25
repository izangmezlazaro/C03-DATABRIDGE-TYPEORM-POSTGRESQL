import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PeliculasService } from './peliculas.service.js';
import { Pelicula } from './pelicula.entity.js';

describe('PeliculasService', () => {
  let service: PeliculasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeliculasService,
        {
          provide: getRepositoryToken(Pelicula),
          useValue: {
            count: vi.fn(),
            create: vi.fn(),
            save: vi.fn(),
            find: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PeliculasService>(PeliculasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
