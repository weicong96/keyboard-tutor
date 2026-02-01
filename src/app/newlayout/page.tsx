"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";

interface VLLFile {
  version: number;
  uid: number;
  layout: (string | number)[][][];
}

export default function NewLayout() {
  const [file, setFile] = useState<File | null>(null);
  const [vllData, setVllData] = useState<VLLFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateVLLFile = (data: any): data is VLLFile => {
    if (!data || typeof data !== "object") return false;
    if (typeof data.version !== "number") return false;
    if (typeof data.uid !== "number") return false;
    if (!Array.isArray(data.layout)) return false;
    
    // Validate layout structure (should be array of layers, each layer is array of rows, each row is array of keys)
    for (const layer of data.layout) {
      if (!Array.isArray(layer)) return false;
      for (const row of layer) {
        if (!Array.isArray(row)) return false;
        for (const key of row) {
          if (typeof key !== "string" && typeof key !== "number") return false;
        }
      }
    }
    
    return true;
  };

  const handleFile = async (file: File) => {
    setError(null);
    setVllData(null);

    // Validate file extension
    if (!file.name.toLowerCase().endsWith(".vll") && !file.name.toLowerCase().endsWith(".vil")) {
      setError("Please upload a .vll file");
      return;
    }

    // Validate file size (e.g., max 1MB)
    if (file.size > 1024 * 1024) {
      setError("File size must be less than 1MB");
      return;
    }

    setIsProcessing(true);
    setFile(file);

    try {
      const text = await file.text();
      console.info(text);
      const data = JSON.parse(text);

      if (!validateVLLFile(data)) {
        setError("Invalid VLL file format. Expected: { version: number, uid: number, layout: array }");
        setIsProcessing(false);
        return;
      }

      setVllData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse VLL file. Make sure it's valid JSON.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    if (!vllData) return;

    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/layouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vllData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to save layout");
      }

      setSaveSuccess(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save layout");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setVllData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Upload Keyboard Layout</h1>

        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          } ${isProcessing ? "opacity-50 pointer-events-none" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".vll,.vil"
            onChange={handleFileInput}
            className="hidden"
          />
          
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-600">Processing file...</p>
            </div>
          ) : vllData ? (
            <div className="flex flex-col items-center">
              <svg
                className="w-16 h-16 text-green-500 mb-4"
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
              <p className="text-lg font-semibold text-green-600 mb-2">
                File loaded successfully!
              </p>
              <p className="text-sm text-gray-600">{file?.name}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                Drag and drop your .vll file here
              </p>
              <p className="text-sm text-gray-500 mb-4">or</p>
              <button
                type="button"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Browse Files
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* File Info */}
        {vllData && (
          <div className="mt-6 p-6 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Layout Information</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <span className="font-medium">{vllData.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">UID:</span>
                <span className="font-medium">{vllData.uid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Layers:</span>
                <span className="font-medium">{vllData.layout.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rows per layer:</span>
                <span className="font-medium">
                  {vllData.layout[0]?.length || 0}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex-1 px-6 py-2 text-white rounded-lg transition-colors ${
                  isSaving
                    ? "bg-gray-400 cursor-not-allowed"
                    : saveSuccess
                    ? "bg-green-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {isSaving ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </span>
                ) : saveSuccess ? (
                  "Saved Successfully!"
                ) : (
                  "Save Layout"
                )}
              </button>
              <button
                onClick={handleReset}
                disabled={isSaving}
                className="flex-1 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}