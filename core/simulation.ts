import { openai, AI_CONFIG } from "@/lib/ai";
import type {
  PersonaReply,
  VariantResult,
  SimulationResult,
  Persona,
} from "./types";

/**
 * Generate variants of a post idea
 */
export async function generateVariants(idea: string): Promise<string[]> {
  const prompt = `You are a social media expert specializing in X (formerly Twitter). Given a post idea, create 10 distinct variants that could maximize engagement.

Each variant should:
- Be suitable for X/Twitter (concise, engaging)
- Have a different tone, hook, or call-to-action
- Maintain the core message
- Be between 150-280 characters when possible

Post idea: "${idea}"

Return exactly 10 variants, numbered 1-10, each on a new line.`;

  const response = await openai.chat.completions.create({
    model: AI_CONFIG.model,
    messages: [{ role: "user", content: prompt }],
    temperature: AI_CONFIG.temperature,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content || "";
  
  // Parse the numbered variants
  const variants = content
    .split("\n")
    .filter((line) => /^\d+\./.test(line.trim()))
    .map((line) => line.replace(/^\d+\.\s*/, "").trim())
    .filter((v) => v.length > 0);

  if (variants.length < 10) {
    throw new Error("Failed to generate 10 variants");
  }

  return variants.slice(0, 10);
}

/**
 * Simulate a persona's reaction to a post variant
 */
async function simulatePersonaReaction(
  variant: string,
  persona: Persona
): Promise<PersonaReply> {
  const personaDescription = `${persona.name}: ${persona.description}`;
  const personaId = persona.id;
  const prompt = `You are simulating a social media user with this profile:
"${personaDescription}"

Someone posts this on X (Twitter):
"${variant}"

As this persona, write a brief reply (1-3 sentences) that this person would realistically post. Be authentic to the persona's characteristics and perspective.

After your reply, on a new line, rate your sentiment as exactly one word: positive, neutral, or negative.`;

  const response = await openai.chat.completions.create({
    model: AI_CONFIG.model,
    messages: [{ role: "user", content: prompt }],
    temperature: AI_CONFIG.temperature,
    max_tokens: 150,
  });

  const content = response.choices[0]?.message?.content || "";
  const lines = content.trim().split("\n");
  
  // Last line should be sentiment
  const sentimentLine = lines[lines.length - 1].toLowerCase();
  let sentiment: "positive" | "neutral" | "negative" = "neutral";
  
  if (sentimentLine.includes("positive")) {
    sentiment = "positive";
  } else if (sentimentLine.includes("negative")) {
    sentiment = "negative";
  }
  
  // Everything except the last line is the reply
  const reply = lines.slice(0, -1).join(" ").trim();

  return {
    personaId,
    personaDescription,
    reply: reply || "Interesting perspective.",
    sentiment,
  };
}

/**
 * Calculate Net Promoter Score from replies
 */
function calculateNPS(replies: PersonaReply[]): number {
  const total = replies.length;
  if (total === 0) return 0;

  const positive = replies.filter((r) => r.sentiment === "positive").length;
  const negative = replies.filter((r) => r.sentiment === "negative").length;

  const promoters = (positive / total) * 100;
  const detractors = (negative / total) * 100;

  return Math.round(promoters - detractors);
}

/**
 * Extract highlights from replies using AI
 */
async function extractHighlights(
  replies: PersonaReply[]
): Promise<{
  positive: string;
  neutral: string;
  negative: string;
}> {
  const positiveReplies = replies.filter((r) => r.sentiment === "positive");
  const neutralReplies = replies.filter((r) => r.sentiment === "neutral");
  const negativeReplies = replies.filter((r) => r.sentiment === "negative");

  const prompt = `Analyze these social media replies and provide a brief summary (one sentence each) highlighting the key themes:

POSITIVE REPLIES:
${positiveReplies.map((r) => `- ${r.reply}`).join("\n") || "None"}

NEUTRAL REPLIES:
${neutralReplies.map((r) => `- ${r.reply}`).join("\n") || "None"}

NEGATIVE REPLIES:
${negativeReplies.map((r) => `- ${r.reply}`).join("\n") || "None"}

Provide three one-sentence summaries in this exact format:
POSITIVE: [summary]
NEUTRAL: [summary]
NEGATIVE: [summary]`;

  const response = await openai.chat.completions.create({
    model: AI_CONFIG.model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.5,
    max_tokens: 300,
  });

  const content = response.choices[0]?.message?.content || "";
  const lines = content.split("\n");

  let positive = "Users expressed positive sentiment.";
  let neutral = "Some users had neutral reactions.";
  let negative = "Some users had concerns.";

  for (const line of lines) {
    if (line.startsWith("POSITIVE:")) {
      positive = line.replace("POSITIVE:", "").trim();
    } else if (line.startsWith("NEUTRAL:")) {
      neutral = line.replace("NEUTRAL:", "").trim();
    } else if (line.startsWith("NEGATIVE:")) {
      negative = line.replace("NEGATIVE:", "").trim();
    }
  }

  return { positive, neutral, negative };
}

/**
 * Simulate reactions for a single variant across selected personas
 */
async function simulateVariant(
  variant: string,
  personas: Persona[],
  onProgress?: (completed: number, total: number) => void
): Promise<VariantResult> {
  const total = personas.length;
  let completed = 0;

  // Run all persona simulations in parallel, but track progress as they complete
  const replyPromises = personas.map(async (persona) => {
    const reply = await simulatePersonaReaction(variant, persona);
    
    // Report progress after each completion
    if (onProgress) {
      completed++;
      onProgress(completed, total);
    }
    
    return reply;
  });

  const replies = await Promise.all(replyPromises);
  const nps = calculateNPS(replies);
  const highlights = await extractHighlights(replies);

  return {
    text: variant,
    nps,
    highlights,
    replies,
  };
}

/**
 * Randomly sample personas from an array (with replacement if needed)
 */
function samplePersonas(personas: Persona[], count: number): Persona[] {
  if (count <= personas.length) {
    // Fisher-Yates shuffle and take first 'count' elements
    const shuffled = [...personas];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
  }

  // Need to sample with replacement
  const sampled: Persona[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * personas.length);
    sampled.push(personas[randomIndex]);
  }
  return sampled;
}

/**
 * Main simulation orchestration
 * Generates variants and simulates reactions across selected personas with progress tracking
 */
export async function runSimulation(
  idea: string,
  personas: Persona[],
  reactionCount: number,
  onProgress?: (completed: number, total: number) => void
): Promise<SimulationResult> {
  // Step 1: Generate 10 variants
  const variants = await generateVariants(idea);

  // Step 2: Sample the requested number of personas (up to 50)
  const sampledPersonas = samplePersonas(personas, Math.min(reactionCount, 50));

  // Step 3: Calculate total reactions needed
  const totalReactions = variants.length * sampledPersonas.length;
  let completedReactions = 0;

  // Step 4: Run all variant simulations in parallel with progress tracking
  const variantResultPromises = variants.map((variant) => {
    return simulateVariant(variant, sampledPersonas, () => {
      // Increment the shared counter atomically
      completedReactions++;
      if (onProgress) {
        onProgress(completedReactions, totalReactions);
      }
    });
  });

  const variantResults = await Promise.all(variantResultPromises);

  // Step 5: Identify the best variant by NPS
  let bestVariantIndex = 0;
  let bestNPS = variantResults[0].nps;

  for (let i = 1; i < variantResults.length; i++) {
    if (variantResults[i].nps > bestNPS) {
      bestNPS = variantResults[i].nps;
      bestVariantIndex = i;
    }
  }

  return {
    bestVariantIndex,
    variants: variantResults,
  };
}

