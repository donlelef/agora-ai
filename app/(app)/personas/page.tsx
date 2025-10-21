"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Agora {
  id: string;
  name: string;
}

interface Persona {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  agoras: Agora[];
}

export default function PersonasPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [agoras, setAgoras] = useState<Agora[]>([]);
  const [selectedAgoraIds, setSelectedAgoraIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchPersonas();
      fetchAgoras();
    }
  }, [isLoaded, isSignedIn]);

  const fetchPersonas = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/personas");
      if (!response.ok) throw new Error("Failed to fetch personas");
      const data = await response.json();
      setPersonas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAgoras = async () => {
    try {
      const response = await fetch("/api/agoras");
      if (!response.ok) throw new Error("Failed to fetch agoras");
      const data = await response.json();
      setAgoras(data);
    } catch (err) {
      console.error("Failed to fetch agoras:", err);
    }
  };

  const toggleAgoraFilter = (agoraId: string) => {
    setSelectedAgoraIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(agoraId)) {
        newSet.delete(agoraId);
      } else {
        newSet.add(agoraId);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSelectedAgoraIds(new Set());
  };

  const filteredPersonas =
    selectedAgoraIds.size === 0
      ? personas
      : personas.filter((persona) =>
          persona.agoras.some((agora) => selectedAgoraIds.has(agora.id))
        );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create persona");
      }

      await fetchPersonas();
      setFormData({ name: "", description: "" });
      setIsCreating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/personas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update persona");

      await fetchPersonas();
      setFormData({ name: "", description: "" });
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this persona?")) return;

    try {
      const response = await fetch(`/api/personas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete persona");
      await fetchPersonas();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const startEdit = (persona: Persona) => {
    setEditingId(persona.id);
    setFormData({ name: persona.name, description: persona.description });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: "", description: "" });
  };

  if (isLoading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Loading personas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Manage Personas
            </h1>
            <p className="text-lg text-gray-600">
              Create AI personas with unique characteristics to build your custom
              audiences.
            </p>
          </div>
          {!isCreating && !editingId && (
            <Button
              onClick={() => setIsCreating(true)}
              variant="primary"
              size="lg"
              className="rounded-full shadow-md hover:shadow-lg ml-6 flex-shrink-0"
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create New Persona</span>
              </span>
            </Button>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl shadow-sm">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-red-700 font-medium">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-sm text-red-600 hover:text-red-800 mt-2 font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Agora Filters */}
        {agoras.length > 0 && (
          <div className="mb-6 bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Filter by Agora
              </h2>
              {selectedAgoraIds.size > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {agoras.map((agora) => {
                const isSelected = selectedAgoraIds.has(agora.id);
                return (
                  <button
                    key={agora.id}
                    onClick={() => toggleAgoraFilter(agora.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-gray-200"
                    }`}
                  >
                    {agora.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                {isCreating ? "Create New Persona" : "Edit Persona"}
              </h3>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editingId) {
                    handleUpdate(editingId);
                  } else {
                    handleCreate(e);
                  }
                }}
                className="space-y-4"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Tech Enthusiast, Skeptical Professional"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1d9bf0] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the persona's characteristics, interests, biases, and how they typically respond to content..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1d9bf0] focus:border-transparent resize-none transition-all"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" variant="primary">
                    {isCreating ? "Create" : "Save Changes"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Personas List */}
        <div className="space-y-4">
          {personas.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 mb-4">
                  You haven't created any personas yet.
                </p>
                <Button onClick={() => setIsCreating(true)} variant="primary">
                  Create Your First Persona
                </Button>
              </CardContent>
            </Card>
          ) : filteredPersonas.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 mb-4">
                  No personas found matching the selected filters.
                </p>
                <Button onClick={clearFilters} variant="secondary">
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPersonas.map((persona) => (
              <Card key={persona.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {persona.name}
                        </h3>
                      </div>
                      {persona.agoras.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {persona.agoras.map((agora) => (
                            <Badge key={agora.id} variant="info">
                              {agora.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-gray-700">{persona.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Created {new Date(persona.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(persona)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit persona"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(persona.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete persona"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

