"use client";

import { useState } from "react";
import { PostInputForm } from "@/components/post-input-form";
import { SimulationResults } from "@/components/simulation-results";
import type { SimulationResult } from "@/core/types";

export default function Home() {
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (idea: string) => {
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idea }),
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
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Agora AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simulate, analyze, and optimize your social media posts before you
            publish.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Test your ideas against 50 diverse AI personas and get actionable
            insights.
          </p>
        </header>

        {/* Main Content */}
        <main>
          {!results && !error && (
            <PostInputForm onSubmit={handleSubmit} isLoading={isLoading} />
          )}

          {error && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Error
                </h3>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {results && (
            <div>
              <div className="mb-6 text-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  ← New Simulation
                </button>
              </div>
              <SimulationResults results={results} />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            Built with Next.js, TypeScript, and AI. Inspired by{" "}
            <a
              href="https://www.societies.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              societies.io
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

