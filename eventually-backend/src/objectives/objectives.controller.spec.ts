import { Test } from '@nestjs/testing';
import { ObjectivesController } from './objectives.controller';
import { ObjectivesService } from './objectives.service';
import type { ObjectiveDto } from './dto/objectiveDto';

describe('ObjectivesController', () => {
  let objectivesController: ObjectivesController;
  let objectivesService: {
    getCompletedness: jest.Mock;
    update: jest.Mock;
  };

  beforeEach(async () => {
    objectivesService = {
      getCompletedness: jest.fn(),
      update: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [ObjectivesController],
      providers: [
        {
          provide: ObjectivesService,
          useValue: objectivesService,
        },
      ],
    }).compile();

    objectivesController = moduleRef.get(ObjectivesController);
  });

  describe('getCompletedness', () => {
    it.each([
      {
        objectiveId: 1,
        result: { isComplete: true, progress: 100 },
      },
      {
        objectiveId: 2,
        result: { isComplete: false, progress: 40 },
      },
    ])('returns completedness for objective $objectiveId', async (test) => {
      objectivesService.getCompletedness.mockResolvedValueOnce(test.result);

      const response = await objectivesController.getCompletedness(
        test.objectiveId,
      );

      expect(objectivesService.getCompletedness).toHaveBeenCalledWith(
        test.objectiveId,
      );
      expect(response).toEqual(test.result);
    });
  });

  describe('update', () => {
    it('returns the updated objective', async () => {
      const objectiveId = 1;
      const dto: ObjectiveDto = { title: 'Updated objective' };
      const updatedObjective = { id: objectiveId, title: dto.title };

      objectivesService.update.mockResolvedValueOnce(updatedObjective);

      const response = await objectivesController.update(objectiveId, dto);

      expect(objectivesService.update).toHaveBeenCalledWith(objectiveId, dto);
      expect(response).toEqual(updatedObjective);
    });
  });
});
