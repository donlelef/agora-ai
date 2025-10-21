/**
 * Core type definitions for the simulation system
 */

export interface PersonaReply {
  personaId: number;
  personaDescription: string;
  reply: string;
  sentiment: "positive" | "neutral" | "negative";
}

export interface VariantResult {
  text: string;
  nps: number;
  highlights: {
    positive: string;
    neutral: string;
    negative: string;
  };
  replies: PersonaReply[];
}

export interface SimulationResult {
  bestVariantIndex: number;
  variants: VariantResult[];
}

export interface SimulationRequest {
  idea: string;
}

