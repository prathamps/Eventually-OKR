import { KeyResultsService } from './key-results.service';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../../prisma.service';
import { KeyResult } from '@prisma/client';
import { KeyResultDto } from './dto/keyResultDto';
import { UpdateKeyResultDto } from './dto/updateKeyResultDto';
import { BadRequestException } from '@nestjs/common';

describe('KeyResultsService', () => {
  let keyResultsService: KeyResultsService;

  const mockPrismaService = {
    keyResult: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
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

  describe('getByObjectiveId', () => {
    it('should return an array of key results for a given objective ID', async () => {
      const objectiveId = 1;
      const mockKeyResults: KeyResult[] = [
        {
          id: 1,
          description: 'Complete the project',
          metric: 'tasks',
          updatedValue: 10,
          targetValue: 10,
          isCompleted: true,
          objectiveId: 1,
          createdAt: new Date(),
        },
        {
          id: 2,
          description: 'Complete the 2nd project ',
          metric: 'tasks',
          updatedValue: 6,
          targetValue: 10,
          isCompleted: false,
          objectiveId: 1,
          createdAt: new Date(),
        },
      ];

      mockPrismaService.keyResult.findMany.mockResolvedValue(mockKeyResults);
      const result = await keyResultsService.getByObjectiveId(objectiveId);

      expect(result).toEqual(mockKeyResults);
      expect(mockPrismaService.keyResult.findMany).toHaveBeenCalledWith({
        where: {
          objectiveId,
        },
      });
    });
  });

  describe('create', () => {
    it('should create a key result for a given objective ID and DTO', async () => {
      const objectiveId = 2;
      const keyResultDto: KeyResultDto = {
        description: 'Complete the project',
        metric: 'tasks',
        updatedValue: 10,
        targetValue: 10,
      };
      const mockCreatedKeyResult: KeyResult = {
        id: 1,
        description: 'Complete the project',
        metric: 'tasks',
        updatedValue: 10,
        targetValue: 10,
        isCompleted: true,
        objectiveId: 2,
        createdAt: new Date(),
      };

      mockPrismaService.keyResult.create.mockResolvedValue(
        mockCreatedKeyResult,
      );

      const response = await keyResultsService.create(
        keyResultDto,
        objectiveId,
      );

      expect(response).toEqual(mockCreatedKeyResult);
      expect(mockPrismaService.keyResult.create).toHaveBeenCalledWith({
        data: {
          ...keyResultDto,
          objectiveId,
        },
      });
    });

    it('should throw when updated value is greater than target value', () => {
      const objectiveId = 2;
      const keyResultDto: KeyResultDto = {
        description: 'Complete the project',
        metric: 'tasks',
        updatedValue: 11,
        targetValue: 10,
      };

      expect(() => keyResultsService.create(keyResultDto, objectiveId)).toThrow(
        BadRequestException,
      );
      expect(mockPrismaService.keyResult.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a key result for a given key result ID and key result DTO', async () => {
      const keyResultId = 1;
      const keyResultDto: Partial<UpdateKeyResultDto> = {
        description: 'Complete the project',
        metric: 'tasks',
        updatedValue: 10,
        targetValue: 10,
      };
      const mockUpdatedKeyResult: KeyResult = {
        id: 1,
        description: 'Complete the project',
        metric: 'tasks',
        updatedValue: 10,
        targetValue: 10,
        isCompleted: true,
        objectiveId: 1,
        createdAt: new Date(),
      };
      mockPrismaService.keyResult.update.mockResolvedValue(
        mockUpdatedKeyResult,
      );
      const response = await keyResultsService.update(
        keyResultDto,
        keyResultId,
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

    it('should throw when updated value is greater than target value', async () => {
      const keyResultId = 1;
      const keyResultDto: Partial<UpdateKeyResultDto> = {
        updatedValue: 11,
      };

      mockPrismaService.keyResult.findUnique.mockResolvedValue({
        updatedValue: 10,
        targetValue: 10,
      });

      await expect(
        keyResultsService.update(keyResultDto, keyResultId),
      ).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.keyResult.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a key result for a given key result ID', async () => {
      const keyResultId = 1;
      const mockDeletedKeyResult: KeyResult = {
        id: 1,
        description: 'Complete the project',
        metric: 'tasks',
        updatedValue: 10,
        targetValue: 10,
        isCompleted: true,
        objectiveId: 1,
        createdAt: new Date(),
      };

      mockPrismaService.keyResult.delete.mockResolvedValue(
        mockDeletedKeyResult,
      );
      const response = await keyResultsService.delete(keyResultId);

      expect(response).toEqual(mockDeletedKeyResult);
      expect(mockPrismaService.keyResult.delete).toHaveBeenCalledWith({
        where: { id: keyResultId },
      });
    });
  });
});
