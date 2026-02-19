// gemini.service.ts

import { Injectable } from '@nestjs/common';
import { GoogleGenAI, type ContentListUnion, type Schema } from '@google/genai';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenAI;

  constructor() {
    this.genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }

  async createEmbedding(text: string) {
    const result = await this.genAI.models.embedContent({
      model: 'gemini-embedding-001',
      contents: text,
    });

    return result.embeddings?.[0]?.values;
  }

  async generate(
    userPrompt: ContentListUnion,
    systemPrompt: string,
    schema?: Schema,
  ) {
    const response = await this.genAI.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.4,
        ...(schema && {
          responseMimeType: 'application/json',
          responseSchema: schema,
        }),
      },
    });

    return response.text;
  }
}
