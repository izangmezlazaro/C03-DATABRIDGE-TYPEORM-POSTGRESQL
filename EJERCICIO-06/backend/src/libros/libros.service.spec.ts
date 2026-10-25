import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Libro } from './libro.entity.js';
import { LibrosService } from './libros.service.js';

describe('LibrosService', () => {
  let service: LibrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LibrosService,
        {
          provide: getRepositoryToken(Libro),
          useValue: {
            find: vi.fn(),
            findOneBy: vi.fn(),
            save: vi.fn(),
            remove: vi.fn(),
            count: vi.fn().mockResolvedValue(1),
          },
        },
      ],
    }).compile();

    service = module.get<LibrosService>(LibrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
