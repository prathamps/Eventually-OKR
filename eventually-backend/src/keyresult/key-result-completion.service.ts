import { type KeyResultDto } from './dto/keyResultDto';

export class KeyResultCompletionService {
  isCompleted(keyResultDto: KeyResultDto): boolean {
    return keyResultDto.progress === 100;
  }
}
