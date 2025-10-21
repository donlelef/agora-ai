import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * Request validation schema for creating a shared post
 */
const CreateSharedPostSchema = z.object({
  postText: z.string().min(1, "Post text is required"),
  nps: z.number(),
  simulationData: z.any(), // Full simulation results as JSON
  notes: z.string().optional(),
  approverEmail: z.string().email("Valid email is required"),
});

/**
 * POST /api/shared-posts
 * Creates a new shared post and sends it for approval
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
    const validation = CreateSharedPostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { postText, nps, simulationData, notes, approverEmail } = validation.data;

    // For now, we'll use the email as the approverId
    // In a production app, you'd look up the user by email and get their Clerk ID
    const approverId = approverEmail;

    // Create the shared post
    const sharedPost = await db.sharedPost.create({
      data: {
        userId,
        postText,
        nps,
        simulationData,
        notes,
        approvals: {
          create: {
            approverId,
            status: "pending",
          },
        },
      },
      include: {
        approvals: true,
      },
    });

    return NextResponse.json(sharedPost, { status: 201 });
  } catch (error) {
    console.error("Error creating shared post:", error);
    return NextResponse.json(
      {
        error: "Failed to create shared post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/shared-posts
 * Gets shared posts for the current user
 * - If user is creator: returns their shared posts
 * - If user is approver: returns posts pending their approval
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const role = searchParams.get("role") || "approver"; // 'creator' or 'approver'

    if (role === "creator") {
      // Get posts created by this user
      const posts = await db.sharedPost.findMany({
        where: {
          userId,
        },
        include: {
          approvals: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(posts);
    } else {
      // Get posts where this user is an approver
      // For now, we match by email stored in approverId
      // In production, you'd need to get the user's email from Clerk
      const approvals = await db.postApproval.findMany({
        where: {
          approverId: userId, // In reality, this would be user's email
        },
        include: {
          sharedPost: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(approvals);
    }
  } catch (error) {
    console.error("Error fetching shared posts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch shared posts",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

