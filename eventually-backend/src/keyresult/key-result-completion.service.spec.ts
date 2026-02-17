import { KeyResultCompletionService } from './key-result-completion.service';
import { Test } from '@nestjs/testing';

describe('KeyResultCompletionService', () => {
  let keyResultCompletionService: KeyResultCompletionService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [KeyResultCompletionService],
    }).compile();

    keyResultCompletionService = moduleRef.get(KeyResultCompletionService);
  });

  describe('isCompleted', () => {
    it('should return true when updated value meets target', () => {
      const keyResultDto = {
        description: 'Complete the project',
        metric: 'tasks',
        updatedValue: 10,
        targetValue: 10,
      };
      const result = keyResultCompletionService.isCompleted(keyResultDto);
      expect(result).toBeTruthy();
    });

    it('should return false when updated value is below target', () => {
      const keyResultDto = {
        description: 'Complete the project',
        metric: 'tasks',
        updatedValue: 7,
        targetValue: 10,
      };
      const result = keyResultCompletionService.isCompleted(keyResultDto);
      expect(result).toBeFalsy();
    });
  });
});
