import { Test, TestingModule } from '@nestjs/testing';
import { KeyResultsService } from './key-results.service';

describe('KeyresultService', () => {
  let service: KeyResultsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KeyResultsService],
    }).compile();

    service = module.get<KeyResultsService>(KeyResultsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
