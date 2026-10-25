import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MascotasService } from './mascotas.service.js';
import { Mascota } from './mascota.entity.js';

describe('MascotasService', () => {
  let service: MascotasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MascotasService,
        {
          provide: getRepositoryToken(Mascota),
          useValue: {
            count: vi.fn(),
            create: vi.fn(),
            save: vi.fn(),
            findOneBy: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MascotasService>(MascotasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
