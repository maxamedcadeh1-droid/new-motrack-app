import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local", quiet: true });
dotenv.config({ quiet: true });

type AiSuggestPayload = {
  prompt?: string;
  context?: unknown;
};

type HttpError = Error & {
  statusCode?: number;
};

const DEFAULT_MODEL = "gemini-2.5-flash";

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (aiClient) {
    return aiClient;
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    const error: HttpError = new Error("GEMINI_API_KEY environment variable is required to execute AI insights.");
    error.statusCode = 500;
    throw error;
  }

  aiClient = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        "User-Agent": "motrack",
      },
    },
  });

  return aiClient;
}

function assertValidPrompt(prompt: unknown): asserts prompt is string {
  if (typeof prompt !== "string" || !prompt.trim()) {
    const error: HttpError = new Error("Context description or custom prompt is required.");
    error.statusCode = 400;
    throw error;
  }
}

export async function generateAiSuggestion(payload: AiSuggestPayload) {
  assertValidPrompt(payload.prompt);

  const systemPrompt = `You are the MoTrack Student Productivity CoPilot, an advanced technical tutor and study coordinator.
Analyze the user's projects, tasks, or study logs and provide modular, bulleted, and hyper-targeted guidelines.
Keep responses actionable, structured in standard Markdown headings, and professional. Avoid fluffy preamble.`;

  const response = await getAiClient().models.generateContent({
    model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
    contents: `${payload.prompt.trim()}\n\nContext details:\n${JSON.stringify(payload.context || {})}`,
    config: {
      systemInstruction: systemPrompt,
      temperature: 0.7,
    },
  });

  return response.text || "";
}

export function getAiSuggestionError(error: unknown) {
  const typedError = error as HttpError;

  return {
    message: typedError?.message || "Failed to contact study model.",
    statusCode: typedError?.statusCode || 500,
  };
}
