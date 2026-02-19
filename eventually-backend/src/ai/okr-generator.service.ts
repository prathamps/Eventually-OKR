import { Injectable } from '@nestjs/common';
import { type Schema, Type } from '@google/genai';
import { GeminiService } from './gemini.service';
import { okrGeneratorPrompt } from './system-prompts';

const okrResponseJsonSchema: Schema = {
  type: Type.OBJECT,
  required: ['title', 'keyResults'],
  properties: {
    title: {
      type: Type.STRING,
    },
    keyResults: {
      type: Type.ARRAY,
      minItems: '1',
      items: {
        type: Type.OBJECT,
        required: ['description', 'currentValue', 'targetValue', 'metricType'],
        properties: {
          description: {
            type: Type.STRING,
          },
          currentValue: {
            type: Type.INTEGER,
          },
          targetValue: {
            type: Type.INTEGER,
          },
          metricType: {
            type: Type.STRING,
          },
        },
      },
    },
  },
};

@Injectable()
export class OkrGeneratorService {
  constructor(private readonly geminiService: GeminiService) {}

  async generate(prompt: string): Promise<string> {
    const generated = await this.geminiService.generate(
      prompt,
      okrGeneratorPrompt,
      okrResponseJsonSchema,
    );

    if (!generated) {
      throw new Error('Gemini returned an empty OKR response');
    }

    return generated;
  }
}
