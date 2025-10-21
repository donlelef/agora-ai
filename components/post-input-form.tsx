"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface Agora {
  id: string;
  name: string;
  personas: { id: string; name: string }[];
}

interface PostInputFormProps {
  onSubmit: (idea: string, agoraId: string, reactionCount: number) => void;
  isLoading: boolean;
}

export function PostInputForm({ onSubmit, isLoading }: PostInputFormProps) {
  const { isLoaded, isSignedIn } = useUser();
  const [idea, setIdea] = useState("");
  const [agoraId, setAgoraId] = useState("");
  const [reactionCount, setReactionCount] = useState(25);
  const [agoras, setAgoras] = useState<Agora[]>([]);
  const [isLoadingAgoras, setIsLoadingAgoras] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchAgoras();
    }
  }, [isLoaded, isSignedIn]);

  const fetchAgoras = async () => {
    try {
      setIsLoadingAgoras(true);
      const response = await fetch("/api/agoras");
      if (response.ok) {
        const data = await response.json();
        setAgoras(data);
        if (data.length > 0) {
          setAgoraId(data[0].id);
        }
      } else {
        console.error("Failed to fetch agoras:", response.status, response.statusText);
      }
    } catch (err) {
      console.error("Failed to fetch agoras:", err);
    } finally {
      setIsLoadingAgoras(false);
    }
  };

  const selectedAgora = agoras.find((a) => a.id === agoraId);
  const maxReactions = selectedAgora ? selectedAgora.personas.length : 50;

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

    if (!agoraId) {
      setError("Please select an agora");
      return;
    }

    onSubmit(idea.trim(), agoraId, reactionCount);
  };

  if (isLoadingAgoras) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="py-12 text-center">
          <p className="text-gray-600">Loading your agoras...</p>
        </CardContent>
      </Card>
    );
  }

  if (agoras.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="py-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Agoras Found
          </h3>
          <p className="text-gray-600 mb-6">
            You need to create an agora (audience) before running simulations.
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => (window.location.href = "/personas")}
              variant="primary"
            >
              1. Create Personas
            </Button>
            <br />
            <Button
              onClick={() => (window.location.href = "/agoras")}
              variant="secondary"
            >
              2. Create an Agora
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="post-idea"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Post Idea
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

          <div>
            <label
              htmlFor="agora"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Select Agora (Target Audience)
            </label>
            <select
              id="agora"
              value={agoraId}
              onChange={(e) => {
                setAgoraId(e.target.value);
                const selected = agoras.find((a) => a.id === e.target.value);
                if (selected) {
                  setReactionCount(
                    Math.min(reactionCount, selected.personas.length)
                  );
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              {agoras.map((agora) => (
                <option key={agora.id} value={agora.id}>
                  {agora.name} ({agora.personas.length} personas)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="reactions"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number of Reactions: {reactionCount}
            </label>
            <input
              id="reactions"
              type="range"
              min="1"
              max={Math.min(maxReactions, 50)}
              value={reactionCount}
              onChange={(e) => setReactionCount(Number(e.target.value))}
              className="w-full"
              disabled={isLoading}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1</span>
              <span>{Math.min(maxReactions, 50)} (max)</span>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading || idea.trim().length < 10 || !agoraId}
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
                Generating 10 variants and simulating {reactionCount} persona
                reactions for each...
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

