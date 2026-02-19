import { BadRequestException, Injectable } from '@nestjs/common';
import { chatBotPrompt } from '../ai/system-prompts';
import { GeminiService } from '../ai/gemini.service';
import { PrismaService } from '../../prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';

type SimilarityResult = {
  objectiveId: number;
  distance: number;
};

@Injectable()
export class ChatBotService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly prismaService: PrismaService,
  ) {}

  async generate(dto: CreateChatDto) {
    if (!dto.chats.length) {
      throw new BadRequestException('At least one chat message is required.');
    }

    const userQuery = dto.chats[dto.chats.length - 1]?.content?.trim();
    if (!userQuery) {
      throw new BadRequestException('Latest chat message content is required.');
    }

    const userQueryEmbedding = await this.geminiService.createEmbedding(userQuery);
    if (!userQueryEmbedding?.length) {
      throw new Error('Gemini returned an empty embedding response');
    }

    const vectorString = `[${userQueryEmbedding.join(',')}]`;
    const similarObjectives = await this.prismaService.$queryRawUnsafe<SimilarityResult[]>(
      `
        SELECT "objectiveId", embedding <=> $1::vector AS distance
        FROM "OkrEmbedding"
        WHERE embedding <=> $1::vector < 0.5
        ORDER BY distance
        LIMIT 5
      `,
      vectorString,
    );

    const objectiveIds = similarObjectives.map((item) => item.objectiveId);
    const retrievedObjectives = objectiveIds.length
      ? await this.prismaService.objective.findMany({
          where: {
            id: {
              in: objectiveIds,
            },
          },
          include: {
            keyResults: true,
          },
        })
      : [];

    const contextByObjectiveId = new Map(
      this.convertObjectivesForPrompt(retrievedObjectives).map((okr) => [
        okr.objective.id,
        okr,
      ]),
    );

    const orderedContext = objectiveIds
      .map((objectiveId) => contextByObjectiveId.get(objectiveId))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));

    const contents = [
      ...dto.chats.map((chat) => ({
        role: chat.role === 'ai' ? 'model' : 'user',
        parts: [{ text: chat.content }],
      })),
      {
        role: 'user',
        parts: [
          {
            text: `Here are my relevant OKRs in JSON:\n${JSON.stringify(
              orderedContext,
              null,
              2,
            )}\nUse them as context when answering.`,
          },
        ],
      },
    ];

    return this.geminiService.generate(contents, chatBotPrompt);
  }

  private convertObjectivesForPrompt(
    objectives: Array<{
      id: number;
      title: string;
      keyResults: Array<{
        description: string;
        updatedValue: number;
        targetValue: number;
        metric: string;
      }>;
    }>,
  ) {
    return objectives.map((objective) => {
      const keyResults = objective.keyResults.map((keyResult) => ({
        description: keyResult.description,
        progress: keyResult.updatedValue,
        target: keyResult.targetValue,
        metric: keyResult.metric,
      }));

      const objectiveProgress = this.calculateObjectiveProgress(objective.keyResults);

      return {
        objective: {
          id: objective.id,
          title: objective.title,
          progress: objectiveProgress,
        },
        keyResults,
      };
    });
  }

  private calculateObjectiveProgress(
    keyResults: Array<{ updatedValue: number; targetValue: number }>,
  ) {
    if (!keyResults.length) {
      return 0;
    }

    const totalProgress = keyResults.reduce((sum, keyResult) => {
      if (
        !Number.isFinite(keyResult.updatedValue) ||
        !Number.isFinite(keyResult.targetValue) ||
        keyResult.targetValue <= 0
      ) {
        return sum;
      }

      return sum + (keyResult.updatedValue / keyResult.targetValue) * 100;
    }, 0);

    return Math.round(totalProgress / keyResults.length);
  }
}

