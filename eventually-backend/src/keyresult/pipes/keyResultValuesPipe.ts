import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

type KeyResultValuesPayload = {
  updatedValue?: number | string;
  targetValue?: number | string;
  metric?: string;
};

@Injectable()
export class KeyResultValuesPipe implements PipeTransform {
  transform(value: KeyResultValuesPayload) {
    if (!value) return value;

    const updates: KeyResultValuesPayload = { ...value };

    if (updates.updatedValue !== undefined && updates.updatedValue !== null) {
      const updatedValue = Number(updates.updatedValue);
      if (Number.isNaN(updatedValue)) {
        throw new BadRequestException('Updated value must be a number.');
      }
      if (updatedValue < 0) {
        throw new BadRequestException('Updated value cannot be negative.');
      }
      updates.updatedValue = updatedValue;
    }

    if (updates.targetValue !== undefined && updates.targetValue !== null) {
      const targetValue = Number(updates.targetValue);
      if (Number.isNaN(targetValue)) {
        throw new BadRequestException('Target value must be a number.');
      }
      if (targetValue <= 0) {
        throw new BadRequestException('Target value should be greater than 0.');
      }
      updates.targetValue = targetValue;
    }

    if (
      updates.updatedValue !== undefined &&
      updates.updatedValue !== null &&
      updates.targetValue !== undefined &&
      updates.targetValue !== null &&
      Number(updates.updatedValue) > Number(updates.targetValue)
    ) {
      throw new BadRequestException(
        'Updated value cannot be greater than target value.',
      );
    }

    if (typeof updates.metric === 'string' && !updates.metric.trim()) {
      throw new BadRequestException('Metric cannot be empty.');
    }

    return updates;
  }
}
