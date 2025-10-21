import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

const PersonaCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

/**
 * GET /api/personas
 * Fetch all personas for the authenticated user
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

    const personas = await db.persona.findMany({
      where: { userId },
      include: {
        agoras: {
          include: {
            agora: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform the response to include agora data
    const transformedPersonas = personas.map((persona) => ({
      ...persona,
      agoras: persona.agoras.map((ap) => ap.agora),
    }));

    return NextResponse.json(transformedPersonas);
  } catch (error) {
    console.error("Error fetching personas:", error);
    return NextResponse.json(
      { error: "Failed to fetch personas" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/personas
 * Create a new persona
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
    const validation = PersonaCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, description } = validation.data;

    const persona = await db.persona.create({
      data: {
        userId,
        name,
        description,
      },
    });

    return NextResponse.json(persona, { status: 201 });
  } catch (error) {
    console.error("Error creating persona:", error);
    return NextResponse.json(
      { error: "Failed to create persona" },
      { status: 500 }
    );
  }
}

