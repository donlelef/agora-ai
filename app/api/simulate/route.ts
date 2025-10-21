import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runSimulation } from "@/core/simulation";

/**
 * Request validation schema
 */
const SimulationRequestSchema = z.object({
  idea: z
    .string()
    .min(10, "Post idea must be at least 10 characters")
    .max(500, "Post idea must be less than 500 characters"),
});

/**
 * POST /api/simulate
 * 
 * Runs a complete simulation for a post idea:
 * 1. Generates 10 variants
 * 2. Simulates 50 persona reactions for each variant (500 total)
 * 3. Calculates NPS and extracts highlights
 * 4. Returns results with the best performing variant
 */
export async function POST(request: NextRequest) {
  try {
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

    const { idea } = validation.data;

    // Run the simulation (this will make ~500+ concurrent API calls)
    const result = await runSimulation(idea);

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
      version: "1.0.0",
      endpoint: "POST /api/simulate",
      expectedBody: {
        idea: "string (10-500 characters)",
      },
    },
    { status: 200 }
  );
}

