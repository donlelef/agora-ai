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
  progress?: { completed: number; total: number } | null;
}

export function PostInputForm({ onSubmit, isLoading, progress }: PostInputFormProps) {
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
          // Try to find California Electorate agora as default
          const californiaAgora = data.find((agora: Agora) => 
            agora.name.toLowerCase().includes("california electorate")
          );
          setAgoraId(californiaAgora?.id || data[0].id);
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
  // Always allow up to 50 reactions
  const maxReactions = 50;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (idea.trim().length < 10) {
      setError("Please enter at least 10 characters");
      return;
    }

    if (idea.trim().length > 280) {
      setError("Please keep your idea under 280 characters");
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
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Main Composer Card */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="pt-6">
            {/* Compose Post Section */}
            <div className="flex space-x-3 mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  Y
                </div>
              </div>
              <div className="flex-1">
                <textarea
                  id="post-idea"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="What's your post idea?"
                  className="w-full px-0 py-2 text-lg border-none focus:ring-0 focus:outline-none resize-none placeholder-gray-500"
                  rows={5}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Character Count */}
            <div className="flex items-center justify-end mb-4 px-3">
              <div className="flex items-center space-x-2">
                <div className={`relative w-8 h-8 ${idea.length > 0 ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
                  <svg className="transform -rotate-90" width="32" height="32">
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke={idea.length > 280 ? "#ef4444" : idea.length > 240 ? "#f59e0b" : "#1d9bf0"}
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${(idea.length / 280) * 87.96} 87.96`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                {idea.length > 0 && (
                  <span className={`text-sm font-semibold transition-colors ${idea.length > 280 ? 'text-red-600' : idea.length > 240 ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {280 - idea.length}
                  </span>
                )}
              </div>
            </div>
            {error && (
              <div className="mb-4 px-3">
                <span className="text-sm text-red-600 font-medium">{error}</span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading || idea.trim().length < 10 || !agoraId}
                className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
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
                  <span className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Run Simulation
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card className="shadow-md">
          <CardContent className="py-4">
            <div className="space-y-4">
              {/* Agora Selection */}
              <div>
                <label
                  htmlFor="agora"
                  className="block text-sm font-semibold text-gray-700 mb-2 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5 text-[#1d9bf0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Target Audience</span>
                </label>
                <select
                  id="agora"
                  value={agoraId}
                  onChange={(e) => {
                    setAgoraId(e.target.value);
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1d9bf0] focus:border-transparent transition-all font-medium text-gray-700"
                  disabled={isLoading}
                >
                  {agoras.map((agora) => (
                    <option key={agora.id} value={agora.id}>
                      {agora.name} ({agora.personas.length} personas)
                    </option>
                  ))}
                </select>
              </div>

              {/* Reaction Count Slider */}
              <div>
                <label
                  htmlFor="reactions"
                  className="block text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-[#1d9bf0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Number of Reactions</span>
                  </div>
                  <span className="text-[#1d9bf0] font-bold text-base">{reactionCount}</span>
                </label>
                <input
                  id="reactions"
                  type="range"
                  min="1"
                  max={maxReactions}
                  value={reactionCount}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1d9bf0]"
                  disabled={isLoading}
                  onChange={(e) => setReactionCount(Number(e.target.value))}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                  <span className="font-medium">1</span>
                  <span className="font-medium">{maxReactions}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading && (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-md">
            <CardContent className="py-6">
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <svg
                    className="animate-spin h-10 w-10 text-[#1d9bf0]"
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
                </div>
                <p className="text-base font-semibold text-gray-700 mb-1">
                  Generating 10 variants and simulating {reactionCount} persona reactions for each...
                </p>
                
                {/* Progress Bar */}
                {progress && (
                  <div className="mt-4 mb-2">
                    <div className="w-full bg-white rounded-full h-4 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-[#1d9bf0] to-[#1a8cd8] h-4 rounded-full transition-all duration-300 ease-out flex items-center justify-center"
                        style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                      >
                        {progress.completed > 0 && (
                          <span className="text-xs font-bold text-white">
                            {Math.round((progress.completed / progress.total) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {progress.completed} of {progress.total} reactions collected
                    </p>
                  </div>
                )}
                
                {!progress && (
                  <p className="text-sm text-gray-600">
                    This may take 1-2 minutes. Grab a coffee! ☕
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}

