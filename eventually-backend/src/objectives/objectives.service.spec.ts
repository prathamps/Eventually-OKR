import { ObjectivesService } from './objectives.service';
import { PrismaService } from '../../prisma.service';
import { Test } from '@nestjs/testing';

describe('ObjectivesService', () => {
  let objectivesService: ObjectivesService;
  const mockPrismaService = {
    objective: {
      findUniqueOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ObjectivesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();
    objectivesService = module.get<ObjectivesService>(ObjectivesService);
  });

  const getMockObjective = (progress: number[]) => {
    return {
      id: 1,
      title: 'Objective 1',
      keyResults: progress.map((key, index) => ({
        id: index,
        description: '',
        progress: key,
        objectiveId: 1,
      })),
    };
  };

  describe('getCompletedness', () => {
    it.each([
      {
        title: 'no key results',
        objective: getMockObjective([]),
        expected: { isComplete: true, progress: 0 },
      },
      {
        title: 'all key results completed',
        objective: getMockObjective([100, 100]),
        expected: { isComplete: true, progress: 100 },
      },
      {
        title: 'one key result incomplete',
        objective: getMockObjective([100, 23]),
        expected: { isComplete: false, progress: 62 },
      },
      {
        title: 'all key results incomplete',
        objective: getMockObjective([0, 50]),
        expected: { isComplete: false, progress: 25 },
      },
    ])(
      'should return $expected when $title',
      async ({ objective, expected }) => {
        // Arrange
        mockPrismaService.objective.findUniqueOrThrow.mockResolvedValue(
          objective,
        );

        // Act
        const result = await objectivesService.getCompletedness(1);

        // Assert
        expect(result).toEqual(expected);
      },
    );
  });
});
