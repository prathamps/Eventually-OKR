import { ObjectivesService } from './objectives.service';
import { PrismaService } from '../../prisma.service';
import { Test } from '@nestjs/testing';
import { GeminiService } from '../ai/gemini.service';

describe('ObjectivesService', () => {
  let objectivesService: ObjectivesService;
  const mockPrismaService = {
    objective: {
      findUniqueOrThrow: jest.fn(),
    },
  };
  const mockGeminiService = {
    createEmbedding: jest.fn(),
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ObjectivesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: GeminiService,
          useValue: mockGeminiService,
        },
      ],
    }).compile();
    objectivesService = module.get<ObjectivesService>(ObjectivesService);
  });

  const getMockObjective = (
    values: Array<{ updatedValue: number; targetValue: number }>,
  ) => {
    return {
      id: 1,
      title: 'Objective 1',
      keyResults: values.map((key, index) => ({
        id: index,
        description: '',
        metric: 'units',
        updatedValue: key.updatedValue,
        targetValue: key.targetValue,
        isCompleted: false,
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
        objective: getMockObjective([
          { updatedValue: 10, targetValue: 10 },
          { updatedValue: 20, targetValue: 20 },
        ]),
        expected: { isComplete: true, progress: 100 },
      },
      {
        title: 'one key result incomplete',
        objective: getMockObjective([
          { updatedValue: 10, targetValue: 10 },
          { updatedValue: 23, targetValue: 100 },
        ]),
        expected: { isComplete: false, progress: 62 },
      },
      {
        title: 'all key results incomplete',
        objective: getMockObjective([
          { updatedValue: 0, targetValue: 100 },
          { updatedValue: 50, targetValue: 100 },
        ]),
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
