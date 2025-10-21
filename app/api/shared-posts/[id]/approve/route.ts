import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { db } from "@/lib/db";

/**
 * Request validation schema for approval/rejection
 */
const ApprovalSchema = z.object({
  feedback: z.string().optional(),
});

/**
 * POST /api/shared-posts/[id]/approve
 * Approves a shared post
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id: sharedPostId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = ApprovalSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { feedback } = validation.data;

    // Find the approval record for this user and post
    const approval = await db.postApproval.findFirst({
      where: {
        sharedPostId,
        approverId: userId,
      },
    });

    if (!approval) {
      return NextResponse.json(
        { error: "Approval request not found" },
        { status: 404 }
      );
    }

    // Update the approval status
    const updatedApproval = await db.postApproval.update({
      where: {
        id: approval.id,
      },
      data: {
        status: "approved",
        feedback,
        updatedAt: new Date(),
      },
      include: {
        sharedPost: true,
      },
    });

    return NextResponse.json(updatedApproval);
  } catch (error) {
    console.error("Error approving post:", error);
    return NextResponse.json(
      {
        error: "Failed to approve post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

