import { HttpStatus } from '@nestjs/common';

export class ObjectiveNotFoundError extends Error {
  constructor(objectiveId: string) {
    super(`Objective with id ${objectiveId} not found`);
  }
  getStatus() {
    return HttpStatus.NOT_FOUND;
  }
}
