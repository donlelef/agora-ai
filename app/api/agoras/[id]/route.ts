import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { z } from "zod";

const AgoraUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
  personaIds: z.array(z.string()).min(1, "At least one persona is required").optional(),
});

/**
 * GET /api/agoras/[id]
 * Fetch a single agora with its personas
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const agora = await db.agora.findFirst({
      where: {
        id: params.id,
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

    // Transform response
    const transformedAgora = {
      ...agora,
      personas: agora.personas.map((ap) => ap.persona),
    };

    return NextResponse.json(transformedAgora);
  } catch (error) {
    console.error("Error fetching agora:", error);
    return NextResponse.json(
      { error: "Failed to fetch agora" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/agoras/[id]
 * Update an agora
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = AgoraUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request", details: validation.error.errors },
        { status: 400 }
      );
    }

    // Verify ownership
    const existing = await db.agora.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Agora not found" },
        { status: 404 }
      );
    }

    const { name, personaIds } = validation.data;

    // If personaIds provided, verify ownership
    if (personaIds) {
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

      // Delete existing associations and create new ones
      await db.agoraPersona.deleteMany({
        where: { agoraId: params.id },
      });

      await db.agoraPersona.createMany({
        data: personaIds.map((personaId) => ({
          agoraId: params.id,
          personaId,
        })),
      });
    }

    // Update agora
    const agora = await db.agora.update({
      where: { id: params.id },
      data: name ? { name } : {},
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

    return NextResponse.json(transformedAgora);
  } catch (error) {
    console.error("Error updating agora:", error);
    return NextResponse.json(
      { error: "Failed to update agora" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agoras/[id]
 * Delete an agora
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify ownership
    const existing = await db.agora.findFirst({
      where: {
        id: params.id,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Agora not found" },
        { status: 404 }
      );
    }

    await db.agora.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agora:", error);
    return NextResponse.json(
      { error: "Failed to delete agora" },
      { status: 500 }
    );
  }
}

