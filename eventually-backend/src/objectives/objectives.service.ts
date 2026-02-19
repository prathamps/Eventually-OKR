import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { KeyResult, Objective, Prisma } from '@prisma/client';
import type { PrismaClient } from '@prisma/client';
import { ObjectiveDto } from './dto/objectiveDto';
import { CreateObjectiveWithKeyResultsDto } from './dto/createObjectiveWithKeyResultsDto';
import { GeminiService } from '../ai/gemini.service';
import { OkrGeneratorService } from '../ai/okr-generator.service';

@Injectable()
export class ObjectivesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly geminiService: GeminiService,
    private readonly okrGeneratorService: OkrGeneratorService,
  ) {}

  getAll(): Promise<Objective[]> {
    return this.prismaService.objective.findMany({
      include: {
        keyResults: true,
      },
    });
  }

  getById(objectiveId: number): Promise<Objective> {
    return this.prismaService.objective.findUniqueOrThrow({
      where: {
        id: objectiveId,
      },
    });
  }

  async create(createObjectiveDto: CreateObjectiveWithKeyResultsDto) {
    const objective = await this.prismaService.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const prisma = tx as PrismaClient;
        const { keyResults, ...objectiveData } = createObjectiveDto;
        const objective = await prisma.objective.create({
          data: objectiveData,
        });

        if (keyResults?.length) {
          await prisma.keyResult.createMany({
            data: keyResults.map((keyResult) => ({
              ...keyResult,
              objectiveId: objective.id,
            })),
          });
        }

        return prisma.objective.findUnique({
          where: { id: objective.id },
          include: { keyResults: true },
        });
      },
    );

    if (objective) {
      await this.createEmbedding(JSON.stringify(objective), objective.id);
    }

    return objective;
  }

  update(objectiveId: number, updateObjectiveDto: ObjectiveDto) {
    return this.prismaService.objective.update({
      where: { id: objectiveId },
      data: updateObjectiveDto,
    });
  }

  async getCompletedness(objectiveId: number) {
    const objective = await this.prismaService.objective.findUniqueOrThrow({
      where: { id: objectiveId },
      include: { keyResults: true },
    });

    return this.checkCompletedness(objective.keyResults);
  }

  delete(objectiveId: number) {
    return this.prismaService.objective.delete({
      where: { id: objectiveId },
    });
  }

  async generateAndCreate(prompt: string) {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      throw new BadRequestException('Prompt is required.');
    }

    const generated = await this.okrGeneratorService.generate(trimmedPrompt);
    const createObjectiveDto = this.parseGeneratedObjective(generated);
    return this.create(createObjectiveDto);
  }

  checkCompletedness(keyResults: KeyResult[]) {
    if (!keyResults.length) {
      return { isComplete: true, progress: 0 };
    }

    const progressValues = keyResults.map((keyResult) =>
      this.calculateProgress(keyResult.updatedValue, keyResult.targetValue),
    );
    const totalProgress = progressValues.reduce((sum, value) => sum + value, 0);
    const progress = Math.round(totalProgress / keyResults.length);
    const isComplete = keyResults.every(
      (keyResult) =>
        keyResult.isCompleted ||
        this.calculateProgress(keyResult.updatedValue, keyResult.targetValue) >=
          100,
    );

    return { isComplete, progress };
  }

  private calculateProgress(updatedValue: number, targetValue: number) {
    if (!Number.isFinite(updatedValue) || !Number.isFinite(targetValue)) {
      return 0;
    }
    if (targetValue <= 0) return 0;
    return (updatedValue / targetValue) * 100;
  }

  private async createEmbedding(okrText: string, objectiveId: number) {
    const embedding = await this.geminiService.createEmbedding(okrText);

    if (!embedding?.length) {
      throw new Error('Gemini returned an empty embedding response');
    }

    await this.prismaService.$executeRaw`
      INSERT INTO "OkrEmbedding" ("embedding", "objectiveId")
      VALUES (${`[${embedding.join(',')}]`}::vector, ${objectiveId})
    `;
  }

  private parseGeneratedObjective(generated: string): CreateObjectiveWithKeyResultsDto {
    let parsed:
      | {
          title?: unknown;
          keyResults?: Array<{
            description?: unknown;
            currentValue?: unknown;
            targetValue?: unknown;
            metricType?: unknown;
          }>;
        }
      | undefined;

    try {
      parsed = JSON.parse(generated);
    } catch {
      throw new BadRequestException('Generated objective is not valid JSON.');
    }

    const title =
      typeof parsed?.title === 'string' ? parsed.title.trim() : '';
    if (!title) {
      throw new BadRequestException('Generated objective title is invalid.');
    }

    const keyResults = Array.isArray(parsed?.keyResults) ? parsed.keyResults : [];
    if (!keyResults.length) {
      throw new BadRequestException('Generated objective must include key results.');
    }

    const mappedKeyResults = keyResults.map((keyResult, index) => {
      const description =
        typeof keyResult?.description === 'string'
          ? keyResult.description.trim()
          : '';
      const updatedValue = Number(keyResult?.currentValue);
      const targetValue = Number(keyResult?.targetValue);
      const metric =
        typeof keyResult?.metricType === 'string'
          ? keyResult.metricType.trim()
          : '';

      if (!description) {
        throw new BadRequestException(
          `Generated key result #${index + 1} has invalid description.`,
        );
      }
      if (!Number.isFinite(updatedValue) || updatedValue < 0) {
        throw new BadRequestException(
          `Generated key result #${index + 1} has invalid currentValue.`,
        );
      }
      if (!Number.isFinite(targetValue) || targetValue <= 0) {
        throw new BadRequestException(
          `Generated key result #${index + 1} has invalid targetValue.`,
        );
      }
      if (updatedValue > targetValue) {
        throw new BadRequestException(
          `Generated key result #${index + 1} currentValue exceeds targetValue.`,
        );
      }
      if (!metric) {
        throw new BadRequestException(
          `Generated key result #${index + 1} has invalid metricType.`,
        );
      }

      return {
        description,
        updatedValue,
        targetValue,
        metric,
      };
    });

    return {
      title,
      keyResults: mappedKeyResults,
    };
  }
}
