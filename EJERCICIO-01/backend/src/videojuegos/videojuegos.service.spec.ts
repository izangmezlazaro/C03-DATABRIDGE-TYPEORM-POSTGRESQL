import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VideojuegosService } from './videojuegos.service.js';
import { Videojuego } from './videojuego.entity.js';

describe('VideojuegosService', () => {
  let service: VideojuegosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideojuegosService,
        {
          provide: getRepositoryToken(Videojuego),
          useValue: {
            count: vi.fn(),
            create: vi.fn(),
            save: vi.fn(),
            find: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VideojuegosService>(VideojuegosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
