import { Test, TestingModule } from '@nestjs/testing';
import { KeyResultsController } from './keyResultsController';

describe('KeyresultController', () => {
  let controller: KeyResultsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeyResultsController],
    }).compile();

    controller = module.get<KeyResultsController>(KeyResultsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
