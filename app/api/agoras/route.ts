import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

const AgoraCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional(),
  personaIds: z.array(z.string()).min(1, "At least one persona is required"),
});

/**
 * GET /api/agoras
 * Fetch all agoras for the authenticated user
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const agoras = await db.agora.findMany({
      where: { userId },
      include: {
        personas: {
          include: {
            persona: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform the response to flatten persona data
    const transformedAgoras = agoras.map((agora) => ({
      ...agora,
      personas: agora.personas.map((ap) => ap.persona),
    }));

    return NextResponse.json(transformedAgoras);
  } catch (error) {
    console.error("Error fetching agoras:", error);
    return NextResponse.json(
      { error: "Failed to fetch agoras" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agoras
 * Create a new agora with associated personas
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

    const body = await request.json();
    const validation = AgoraCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, description, personaIds } = validation.data;

    // Verify all personas belong to the user
    const personas = await db.persona.findMany({
      where: {
        id: { in: personaIds },
        userId,
      },
    });

    if (personas.length !== personaIds.length) {
      return NextResponse.json(
        { error: "One or more personas not found or not owned by user" },
        { status: 400 }
      );
    }

    // Create agora with persona associations
    const agora = await db.agora.create({
      data: {
        userId,
        name,
        description: description || null,
        personas: {
          create: personaIds.map((personaId) => ({
            personaId,
          })),
        },
      },
      include: {
        personas: {
          include: {
            persona: true,
          },
        },
      },
    });

    // Transform response
    const transformedAgora = {
      ...agora,
      personas: agora.personas.map((ap) => ap.persona),
    };

    return NextResponse.json(transformedAgora, { status: 201 });
  } catch (error) {
    console.error("Error creating agora:", error);
    return NextResponse.json(
      { error: "Failed to create agora" },
      { status: 500 }
    );
  }
}

