import { Test, TestingModule } from '@nestjs/testing';
import { MascotasController } from './mascotas.controller.js';
import { MascotasService } from './mascotas.service.js';

describe('MascotasController', () => {
  let controller: MascotasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MascotasController],
      providers: [
        {
          provide: MascotasService,
          useValue: {
            findOne: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MascotasController>(MascotasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
