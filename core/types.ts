/**
 * Core type definitions for the simulation system
 */

export interface PersonaReply {
  personaId: string;
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
  agoraId: string;
  reactionCount: number;
}

export interface Persona {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agora {
  id: string;
  userId: string;
  name: string;
  personas: Persona[];
  createdAt: Date;
  updatedAt: Date;
}

