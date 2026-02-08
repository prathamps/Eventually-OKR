import { Test, TestingModule } from '@nestjs/testing';
import { ObjectivesController } from './objectives.controller';

describe('ObjectivesController', () => {
  let controller: ObjectivesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObjectivesController],
    }).compile();

    controller = module.get<ObjectivesController>(ObjectivesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
