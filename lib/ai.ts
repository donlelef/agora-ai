import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is not set");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Configuration for AI model selection
 */
export const AI_CONFIG = {
  model: "gpt-4.1-nano",
  temperature: 1,
  max_tokens: 800,
} as const;

