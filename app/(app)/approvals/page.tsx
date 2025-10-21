"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TwitterPost } from "@/components/twitter-post";
import { NPSGauge } from "@/components/nps-gauge";

interface SharedPost {
  id: string;
  userId: string;
  postText: string;
  nps: number;
  simulationData: any;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PostApproval {
  id: string;
  sharedPostId: string;
  approverId: string;
  status: "pending" | "approved" | "rejected";
  feedback?: string;
  createdAt: string;
  updatedAt: string;
  sharedPost: SharedPost;
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<PostApproval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [feedbackInput, setFeedbackInput] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/shared-posts?role=approver");
      
      if (!response.ok) {
        throw new Error("Failed to fetch approvals");
      }

      const data = await response.json();
      setApprovals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (sharedPostId: string, approvalId: string) => {
    setProcessingId(approvalId);
    try {
      const response = await fetch(`/api/shared-posts/${sharedPostId}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback: feedbackInput[approvalId] || "",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve post");
      }

      // Refresh the list
      await fetchApprovals();
      setFeedbackInput({ ...feedbackInput, [approvalId]: "" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve post");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (sharedPostId: string, approvalId: string) => {
    const feedback = feedbackInput[approvalId]?.trim();
    
    if (!feedback) {
      alert("Please provide feedback when rejecting a post");
      return;
    }

    setProcessingId(approvalId);
    try {
      const response = await fetch(`/api/shared-posts/${sharedPostId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject post");
      }

      // Refresh the list
      await fetchApprovals();
      setFeedbackInput({ ...feedbackInput, [approvalId]: "" });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject post");
    } finally {
      setProcessingId(null);
    }
  };

  const getNPSColor = (nps: number) => {
    if (nps >= 50) return "success";
    if (nps >= 0) return "info";
    if (nps >= -50) return "warning";
    return "danger";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success" className="text-xs">Approved</Badge>;
      case "rejected":
        return <Badge variant="danger" className="text-xs">Rejected</Badge>;
      case "pending":
      default:
        return <Badge variant="warning" className="text-xs">Pending</Badge>;
    }
  };

  const pendingApprovals = approvals.filter((a) => a.status === "pending");
  const completedApprovals = approvals.filter((a) => a.status !== "pending");

  if (isLoading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <svg
                className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-gray-600">Loading approvals...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
            <p className="text-red-700">{error}</p>
            <Button onClick={fetchApprovals} className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Post Approvals</h1>
          <p className="text-lg text-gray-600">
            Review and approve posts shared with you
          </p>
        </header>

        {/* Pending Approvals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            Pending Approvals
            {pendingApprovals.length > 0 && (
              <Badge variant="warning" className="text-sm">
                {pendingApprovals.length}
              </Badge>
            )}
          </h2>

          {pendingApprovals.length === 0 ? (
            <Card className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12">
              <div className="text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  No pending approvals
                </p>
                <p className="text-gray-500">
                  You&apos;re all caught up! New approval requests will appear here.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {pendingApprovals.map((approval) => (
                <Card
                  key={approval.id}
                  className="bg-white rounded-2xl border-2 border-gray-200 shadow-sm overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={getNPSColor(approval.sharedPost.nps)}
                          className="text-sm px-3 py-1"
                        >
                          NPS: {approval.sharedPost.nps}
                        </Badge>
                        {getStatusBadge(approval.status)}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(approval.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Notes */}
                    {approval.sharedPost.notes && (
                      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          Notes from creator:
                        </p>
                        <p className="text-sm text-blue-800">
                          {approval.sharedPost.notes}
                        </p>
                      </div>
                    )}

                    {/* Post Content */}
                    <div className="mb-4 bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <TwitterPost
                        text={approval.sharedPost.postText}
                        verified={true}
                      />
                    </div>

                    {/* NPS Gauge (small) */}
                    <div className="mb-4">
                      <div className="scale-50 origin-top-left">
                        <NPSGauge score={approval.sharedPost.nps} />
                      </div>
                    </div>

                    {/* Feedback Input */}
                    <div className="mb-4">
                      <label
                        htmlFor={`feedback-${approval.id}`}
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Feedback (optional for approval, required for rejection)
                      </label>
                      <textarea
                        id={`feedback-${approval.id}`}
                        value={feedbackInput[approval.id] || ""}
                        onChange={(e) =>
                          setFeedbackInput({
                            ...feedbackInput,
                            [approval.id]: e.target.value,
                          })
                        }
                        placeholder="Add your feedback here..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        disabled={processingId === approval.id}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        onClick={() =>
                          handleReject(approval.sharedPostId, approval.id)
                        }
                        variant="outline"
                        disabled={processingId === approval.id}
                        className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                      >
                        {processingId === approval.id ? "Processing..." : "Reject"}
                      </Button>
                      <Button
                        onClick={() =>
                          handleApprove(approval.sharedPostId, approval.id)
                        }
                        disabled={processingId === approval.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {processingId === approval.id ? "Processing..." : "Approve"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Completed Approvals */}
        {completedApprovals.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Completed Approvals
            </h2>
            <div className="space-y-4">
              {completedApprovals.map((approval) => (
                <Card
                  key={approval.id}
                  className="bg-gray-50 rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          variant={getNPSColor(approval.sharedPost.nps)}
                          className="text-xs"
                        >
                          NPS: {approval.sharedPost.nps}
                        </Badge>
                        {getStatusBadge(approval.status)}
                        <span className="text-xs text-gray-500">
                          {new Date(approval.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                        {approval.sharedPost.postText}
                      </p>
                      {approval.feedback && (
                        <p className="text-xs text-gray-600 italic">
                          Your feedback: {approval.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

