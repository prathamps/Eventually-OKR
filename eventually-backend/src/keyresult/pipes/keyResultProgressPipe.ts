import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

type KeyResultProgressPayload = {
  progress?: number | string;
};

@Injectable()
export class KeyResultProgressPipe implements PipeTransform {
  transform(value: KeyResultProgressPayload) {
    if (value?.progress === undefined || value?.progress === null) {
      return value;
    }

    const progress = Number(value.progress);
    if (Number.isNaN(progress)) {
      throw new BadRequestException('Progress must be a number.');
    }
    if (progress < 0 || progress > 100) {
      throw new BadRequestException('Progress must be between 0 and 100.');
    }

    return { ...value, progress };
  }
}
