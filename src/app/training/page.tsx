"use client";

import { useRouter } from "next/navigation";
import { useTraining } from "@/providers/training-provider";

export default function Training() {
  const router = useRouter();
  const { layouts, loadingLayouts } = useTraining();

  const handleLayoutClick = (layoutId: string) => {
    router.push(`/training/${layoutId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">Available Keyboard Layouts</h1>
      
      {loadingLayouts ? (
        <p className="text-gray-600">Loading layouts...</p>
      ) : layouts.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">No layouts found.</p>
          <p className="text-sm text-gray-500">Create a layout first to start training.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-6xl">
          {layouts.map((layout) => (
            <div
              key={layout.id}
              onClick={() => handleLayoutClick(layout.id)}
              className="p-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:shadow-xl transition-all cursor-pointer bg-white"
            >
              <div className="font-semibold text-lg mb-2">Layout #{layout.id.slice(0, 8)}</div>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Layers:</span> {layout.layers}</p>
                <p><span className="font-medium">Keys:</span> {layout.totalKeys}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Created: {new Date(layout.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

