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
    it('should return true when progress is 100', () => {
      const keyResultDto = {
        description: 'Complete the project',
        progress: 100,
      };
      const result = keyResultCompletionService.isCompleted(keyResultDto);
      expect(result).toBeTruthy();
    });

    it('should return false when progress is less than 100', () => {
      const keyResultDto = {
        description: 'Complete the project',
        progress: 75,
      };
      const result = keyResultCompletionService.isCompleted(keyResultDto);
      expect(result).toBeFalsy();
    });
  });
});
