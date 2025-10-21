import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

/**
 * GET /api/shared-posts/[id]
 * Gets a specific shared post with all its details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const sharedPost = await db.sharedPost.findUnique({
      where: {
        id,
      },
      include: {
        approvals: true,
      },
    });

    if (!sharedPost) {
      return NextResponse.json(
        { error: "Shared post not found" },
        { status: 404 }
      );
    }

    // Check if user has access (creator or approver)
    const isCreator = sharedPost.userId === userId;
    const isApprover = sharedPost.approvals.some(
      (approval) => approval.approverId === userId
    );

    if (!isCreator && !isApprover) {
      return NextResponse.json(
        { error: "Forbidden: You don't have access to this post" },
        { status: 403 }
      );
    }

    return NextResponse.json(sharedPost);
  } catch (error) {
    console.error("Error fetching shared post:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch shared post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/shared-posts/[id]
 * Deletes a shared post (only creator can delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const sharedPost = await db.sharedPost.findUnique({
      where: {
        id,
      },
    });

    if (!sharedPost) {
      return NextResponse.json(
        { error: "Shared post not found" },
        { status: 404 }
      );
    }

    // Only creator can delete
    if (sharedPost.userId !== userId) {
      return NextResponse.json(
        { error: "Forbidden: Only the creator can delete this post" },
        { status: 403 }
      );
    }

    await db.sharedPost.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting shared post:", error);
    return NextResponse.json(
      {
        error: "Failed to delete shared post",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

