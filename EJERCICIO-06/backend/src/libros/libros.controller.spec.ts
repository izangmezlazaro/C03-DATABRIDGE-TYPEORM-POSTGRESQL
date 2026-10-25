import { Test, TestingModule } from '@nestjs/testing';
import { LibrosController } from './libros.controller.js';
import { LibrosService } from './libros.service.js';

describe('LibrosController', () => {
  let controller: LibrosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibrosController],
      providers: [
        {
          provide: LibrosService,
          useValue: {
            findAll: vi.fn(),
            marcarLeido: vi.fn(),
            remove: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<LibrosController>(LibrosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
