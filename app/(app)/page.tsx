"use client";

import { useState } from "react";
import { PostInputForm } from "@/components/post-input-form";
import { SimulationResults } from "@/components/simulation-results";
import type { SimulationResult } from "@/core/types";

export default function Home() {
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (idea: string, agoraId: string, reactionCount: number) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea, agoraId, reactionCount }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Simulation failed");
      }

      setResults(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {!results && (
          <header className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Test Your Posts Before You Share
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simulate reactions from custom AI audiences and optimize your content for maximum engagement
            </p>
          </header>
        )}

        {/* Main Content */}
        <main>
          {!results && !error && (
            <PostInputForm onSubmit={handleSubmit} isLoading={isLoading} />
          )}

          {error && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6 shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      Something went wrong
                    </h3>
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                      onClick={handleReset}
                      className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors font-semibold shadow-md hover:shadow-lg"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {results && (
            <div>
              <div className="mb-6 flex items-center justify-center">
                <button
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>New Simulation</span>
                </button>
              </div>
              <SimulationResults results={results} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

