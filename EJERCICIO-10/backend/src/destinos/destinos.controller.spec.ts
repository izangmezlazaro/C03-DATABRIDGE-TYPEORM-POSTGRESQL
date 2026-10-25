import { Test, TestingModule } from '@nestjs/testing';
import { DestinosController } from './destinos.controller.js';

describe('DestinosController', () => {
  let controller: DestinosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DestinosController],
    }).compile();

    controller = module.get<DestinosController>(DestinosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
