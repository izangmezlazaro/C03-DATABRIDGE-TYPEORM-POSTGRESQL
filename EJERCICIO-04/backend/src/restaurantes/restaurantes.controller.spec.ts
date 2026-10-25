import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantesController } from './restaurantes.controller.js';
import { RestaurantesService } from './restaurantes.service.js';

describe('RestaurantesController', () => {
  let controller: RestaurantesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantesController],
      providers: [
        {
          provide: RestaurantesService,
          useValue: {
            create: vi.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RestaurantesController>(RestaurantesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
