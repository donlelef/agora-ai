"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Persona {
  id: string;
  name: string;
  description: string;
}

interface Agora {
  id: string;
  name: string;
  personas: Persona[];
  createdAt: string;
}

export default function AgorasPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [agoras, setAgoras] = useState<Agora[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    personaIds: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchData();
    }
  }, [isLoaded, isSignedIn]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [agorasRes, personasRes] = await Promise.all([
        fetch("/api/agoras"),
        fetch("/api/personas"),
      ]);

      if (!agorasRes.ok || !personasRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const [agorasData, personasData] = await Promise.all([
        agorasRes.json(),
        personasRes.json(),
      ]);

      setAgoras(agorasData);
      setPersonas(personasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/agoras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create agora");
      }

      await fetchData();
      setFormData({ name: "", personaIds: [] });
      setIsCreating(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const response = await fetch(`/api/agoras/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update agora");

      await fetchData();
      setFormData({ name: "", personaIds: [] });
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this agora?")) return;

    try {
      const response = await fetch(`/api/agoras/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete agora");
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const startEdit = (agora: Agora) => {
    setEditingId(agora.id);
    setFormData({
      name: agora.name,
      personaIds: agora.personas.map((p) => p.id),
    });
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: "", personaIds: [] });
  };

  const togglePersona = (personaId: string) => {
    setFormData((prev) => ({
      ...prev,
      personaIds: prev.personaIds.includes(personaId)
        ? prev.personaIds.filter((id) => id !== personaId)
        : [...prev.personaIds, personaId],
    }));
  };

  if (isLoading) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Loading agoras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Manage Agoras
          </h1>
          <p className="text-lg text-gray-600">
            Create custom audiences by grouping personas together.
          </p>
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

        {personas.length === 0 && (
          <Card className="mb-6">
            <CardContent className="py-8 text-center">
              <p className="text-gray-600 mb-4">
                You need to create personas before you can create an agora.
              </p>
              <Button
                onClick={() => (window.location.href = "/personas")}
                variant="primary"
              >
                Go to Personas
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create New Button */}
        {!isCreating && !editingId && personas.length > 0 && (
          <div className="mb-6">
            <Button
              onClick={() => setIsCreating(true)}
              variant="primary"
              size="lg"
              className="rounded-full shadow-md hover:shadow-lg"
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create New Agora</span>
              </span>
            </Button>
          </div>
        )}

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">
                {isCreating ? "Create New Agora" : "Edit Agora"}
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
                    Agora Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Early Adopters, Skeptical Enterprise Buyers"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1d9bf0] focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Personas ({formData.personaIds.length} selected)
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto border-2 border-gray-200 rounded-xl p-3">
                    {personas.map((persona) => (
                      <label
                        key={persona.id}
                        className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.personaIds.includes(persona.id)}
                          onChange={() => togglePersona(persona.id)}
                          className="mt-1 w-4 h-4 text-[#1d9bf0] border-gray-300 rounded focus:ring-[#1d9bf0]"
                        />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {persona.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {persona.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={formData.personaIds.length === 0}
                  >
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

        {/* Agoras List */}
        <div className="space-y-4">
          {agoras.length === 0 && personas.length > 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600 mb-4">
                  You haven't created any agoras yet.
                </p>
                <Button onClick={() => setIsCreating(true)} variant="primary">
                  Create Your First Agora
                </Button>
              </CardContent>
            </Card>
          ) : (
            agoras.map((agora) => (
              <Card key={agora.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {agora.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {agora.personas.length} persona(s) · Created{" "}
                        {new Date(agora.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => startEdit(agora)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(agora.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {agora.personas.map((persona) => (
                      <Badge key={persona.id} variant="info">
                        {persona.name}
                      </Badge>
                    ))}
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

