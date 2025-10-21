import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { runSimulation } from "@/core/simulation";
import { db } from "@/lib/db";

/**
 * Request validation schema
 */
const SimulationRequestSchema = z.object({
  idea: z
    .string()
    .min(10, "Post idea must be at least 10 characters")
    .max(500, "Post idea must be less than 500 characters"),
  agoraId: z.string().min(1, "Agora ID is required"),
  reactionCount: z
    .number()
    .int()
    .min(1, "At least 1 reaction is required")
    .max(50, "Maximum 50 reactions allowed"),
});

/**
 * POST /api/simulate
 * 
 * Runs a complete simulation for a post idea against a selected agora:
 * 1. Fetches the agora and its personas
 * 2. Samples the requested number of personas
 * 3. Generates 10 post variants
 * 4. Simulates reactions for each variant
 * 5. Calculates NPS and extracts highlights
 * 6. Returns results with the best performing variant
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = SimulationRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { idea, agoraId, reactionCount } = validation.data;

    // Fetch the agora with its personas
    const agora = await db.agora.findFirst({
      where: {
        id: agoraId,
        userId,
      },
      include: {
        personas: {
          include: {
            persona: true,
          },
        },
      },
    });

    if (!agora) {
      return NextResponse.json(
        { error: "Agora not found" },
        { status: 404 }
      );
    }

    // Extract personas from the agora
    const personas = agora.personas.map((ap) => ap.persona);

    if (personas.length === 0) {
      return NextResponse.json(
        { error: "This agora has no personas. Please add personas to the agora first." },
        { status: 400 }
      );
    }

    if (reactionCount > personas.length) {
      return NextResponse.json(
        {
          error: `Cannot simulate ${reactionCount} reactions with only ${personas.length} personas in this agora.`,
        },
        { status: 400 }
      );
    }

    // Run the simulation
    const result = await runSimulation(idea, personas, reactionCount);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Simulation error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Simulation failed",
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/simulate
 * Returns information about the API endpoint
 */
export async function GET() {
  return NextResponse.json(
    {
      message: "Agora AI Simulation API",
      version: "2.0.0",
      endpoint: "POST /api/simulate",
      expectedBody: {
        idea: "string (10-500 characters)",
        agoraId: "string (Agora ID)",
        reactionCount: "number (1-50)",
      },
    },
    { status: 200 }
  );
}

