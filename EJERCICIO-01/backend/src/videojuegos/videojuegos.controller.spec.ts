import { Test, TestingModule } from '@nestjs/testing';
import { VideojuegosController } from './videojuegos.controller.js';
import { VideojuegosService } from './videojuegos.service.js';

describe('VideojuegosController', () => {
  let controller: VideojuegosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideojuegosController],
      providers: [
        {
          provide: VideojuegosService,
          useValue: {
            findAll: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<VideojuegosController>(VideojuegosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
