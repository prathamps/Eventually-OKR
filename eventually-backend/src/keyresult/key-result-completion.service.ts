import { type KeyResultDto } from './dto/keyResultDto';

export class KeyResultCompletionService {
  isCompleted(keyResultDto: KeyResultDto): boolean {
    if (!Number.isFinite(keyResultDto.targetValue)) return false;
    if (keyResultDto.targetValue <= 0) return false;
    return keyResultDto.updatedValue >= keyResultDto.targetValue;
  }
}
