import { KeyResultsService } from './key-results.service';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { KeyResult } from '../../generated/prisma/client';
import { KeyResultDtoType } from './dto/key-result-dto.type';
import { ObjectiveNotFoundError } from '../objective/error/objectiveNotFoundError';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

describe('KeyResultsService', () => {
  let keyResultsService: KeyResultsService;

  const mockPrismaService = {
    keyResult: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
    objective: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        KeyResultsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();
    keyResultsService = await module.resolve(KeyResultsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return an array of key results', async () => {
      const mockKeyResults: KeyResult[] = [
        {
          id: '1',
          description: 'Complete the project',
          progress: 100,
          is_completed: true,
          objectiveId: '1',
        },
        {
          id: '2',
          description: 'Complete the 2nd project ',
          progress: 75,
          is_completed: false,
          objectiveId: '2',
        },
      ];

      mockPrismaService.keyResult.findMany.mockResolvedValue(mockKeyResults);

      const result = await keyResultsService.fetchAll();

      expect(result).toEqual(mockKeyResults);
      expect(mockPrismaService.keyResult.findMany).toHaveBeenCalled();
    });
  });
  describe('getByObjectiveId', () => {
    it('should return an array of key results for a given objective ID', async () => {
      const objectiveId = '1';
      const mockKeyResults: KeyResult[] = [
        {
          id: '1',
          description: 'Complete the project',
          progress: 100,
          is_completed: true,
          objectiveId: '1',
        },
        {
          id: '2',
          description: 'Complete the 2nd project ',
          progress: 75,
          is_completed: false,
          objectiveId: '1',
        },
      ];

      mockPrismaService.keyResult.findMany.mockResolvedValue(mockKeyResults);
      mockPrismaService.objective.findUnique.mockResolvedValue(true);
      const result = await keyResultsService.getByObjectiveId(objectiveId);

      expect(result).toEqual(mockKeyResults);
      expect(mockPrismaService.keyResult.findMany).toHaveBeenCalledWith({
        where: {
          objectiveId,
        },
      });
    });

    it('should throw an error if the objective does not exist', async () => {
      const objectiveId = 'non-existent-id';
      mockPrismaService.objective.findUnique.mockResolvedValue(null);

      const result = keyResultsService.getByObjectiveId(objectiveId);

      await expect(result).rejects.toThrow(ObjectiveNotFoundError);
      expect(mockPrismaService.keyResult.findMany).not.toHaveBeenCalled();
    });
  });
  describe('getById', () => {
    it('should return a key result for a given key result ID', async () => {
      const keyResultId = '1';
      const mockKeyResult: KeyResult = {
        id: '1',
        description: 'Complete the project',
        progress: 100,
        is_completed: true,
        objectiveId: '1',
      };
      mockPrismaService.keyResult.findUniqueOrThrow.mockResolvedValue(
        mockKeyResult,
      );
      const response = await keyResultsService.getById(keyResultId);
      expect(response).toEqual(mockKeyResult);
      expect(
        mockPrismaService.keyResult.findUniqueOrThrow,
      ).toHaveBeenCalledWith({
        where: {
          id: keyResultId,
        },
      });
    });
    it('should throw an error if the key result does not exist', async () => {
      const keyResultId = 'non-existent-id';

      const error = new PrismaClientKnownRequestError('Not found', {
        code: 'P2025',
        clientVersion: '1.0.0',
      });

      mockPrismaService.keyResult.findUniqueOrThrow.mockRejectedValue(error);

      const response = keyResultsService.getById(keyResultId);

      await expect(response).rejects.toThrow(
        `KeyResult with id ${keyResultId} not found`,
      );
    });
  });
  describe('update', () => {
    it('should update a key result for a given key result ID and key result DTO', async () => {
      const keyResultId = '1';
      const keyResultDto: KeyResultDtoType = {
        description: 'Complete the project',
        progress: 100,
      };
      const mockUpdatedKeyResult: KeyResult = {
        id: '1',
        description: 'Complete the project',
        progress: 100,
        is_completed: true,
        objectiveId: '1',
      };
      mockPrismaService.keyResult.update.mockResolvedValue(
        mockUpdatedKeyResult,
      );
      const response = await keyResultsService.update(
        keyResultId,
        keyResultDto,
      );
      expect(response).toEqual(mockUpdatedKeyResult);
      expect(mockPrismaService.keyResult.update).toHaveBeenCalledWith({
        where: {
          id: keyResultId,
        },
        data: {
          ...keyResultDto,
        },
      });
    });
  });
});
