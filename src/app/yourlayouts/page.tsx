"use client";

import { useState, useEffect } from "react";

interface Layout {
  id: string;
  createdAt: string;
  modifiedAt: string;
  layers: number;
  totalKeys: number;
}

export default function YourLayouts() {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLayouts();
  }, []);

  const fetchLayouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/layouts");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch layouts");
      }

      setLayouts(data.layouts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch layouts");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Layouts</h1>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
            <button
              onClick={fetchLayouts}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && layouts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No layouts found</p>
            <p className="text-gray-500">
              Upload your first keyboard layout to get started!
            </p>
          </div>
        )}

        {!loading && !error && layouts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {layouts.map((layout) => (
              <div
                key={layout.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-bold mb-3">
                  Layout {layout.id.slice(0, 8)}
                </h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Layers:</span>
                    <span className="font-medium">{layout.layers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Keys:</span>
                    <span className="font-medium">{layout.totalKeys}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      Created: {formatDate(layout.createdAt)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Modified: {formatDate(layout.modifiedAt)}
                    </div>
                  </div>
                </div>
                <button
                  className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  onClick={() => {
                    // TODO: Navigate to layout detail page or edit
                    console.log("View layout:", layout.id);
                  }}
                >
                  View Layout
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}