import { Test, TestingModule } from '@nestjs/testing';
import { PeliculasController } from './peliculas.controller.js';
import { PeliculasService } from './peliculas.service.js';

describe('PeliculasController', () => {
  let controller: PeliculasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeliculasController],
      providers: [
        {
          provide: PeliculasService,
          useValue: {
            findAll: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PeliculasController>(PeliculasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
