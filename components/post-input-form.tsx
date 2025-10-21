"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface PostInputFormProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

export function PostInputForm({ onSubmit, isLoading }: PostInputFormProps) {
  const [idea, setIdea] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (idea.trim().length < 10) {
      setError("Please enter at least 10 characters");
      return;
    }

    if (idea.trim().length > 500) {
      setError("Please keep your idea under 500 characters");
      return;
    }

    onSubmit(idea.trim());
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="post-idea"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              What&apos;s your post idea?
            </label>
            <textarea
              id="post-idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Example: Announcing our new AI-powered analytics feature that helps users understand their data better..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              rows={4}
              disabled={isLoading}
            />
            <div className="mt-2 flex items-center justify-between">
              <span
                className={`text-sm ${
                  idea.length > 500
                    ? "text-red-600"
                    : idea.length > 400
                    ? "text-yellow-600"
                    : "text-gray-500"
                }`}
              >
                {idea.length} / 500 characters
              </span>
              {error && <span className="text-sm text-red-600">{error}</span>}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading || idea.trim().length < 10}
            className="w-full"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Running simulation...
              </span>
            ) : (
              "Run Simulation"
            )}
          </Button>

          {isLoading && (
            <div className="text-center text-sm text-gray-600">
              <p>
                Generating 10 variants and simulating 50 persona reactions for
                each...
              </p>
              <p className="mt-1 text-xs text-gray-500">
                This may take 1-2 minutes
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

