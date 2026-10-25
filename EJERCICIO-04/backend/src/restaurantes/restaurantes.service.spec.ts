import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Restaurante } from './restaurante.entity.js';
import { RestaurantesService } from './restaurantes.service.js';

describe('RestaurantesService', () => {
  let service: RestaurantesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantesService,
        {
          provide: getRepositoryToken(Restaurante),
          useValue: {
            create: vi.fn(),
            save: vi.fn(),
            find: vi.fn(),
            findOneBy: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantesService>(RestaurantesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
