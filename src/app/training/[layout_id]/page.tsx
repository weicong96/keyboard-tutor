"use client";

import WordList from "@/components/wordlist";
import InputField from "@/components/inputfield";
import { useState, useEffect } from "react";
import KeyboardLayout from "@/components/keyboard_layout";
import { useParams, useRouter } from "next/navigation";
import { useTraining } from "@/providers/training-provider";
const defaultWords = [
  "react",
  "keyboard",
  "layout",
  "typing",
  "practice",
  "words",
  "list",
  "speed",
  "accuracy",
];

const shuffleWords = (w: string[]) => {
  const arr = [...w];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface LayoutData {
  id: string;
  createdAt: string;
  modifiedAt: string;
  layers: (string | number)[][][];
}

export default function TrainingWithLayout() {
  const { selectedLayout, setSelectedLayout, selectedLayer, setSelectedLayer, getDisplayKeyLabel } = useTraining();
  const params = useParams();
  const router = useRouter();
  const layoutId = params.layout_id as string;
  
  const [words, setWords] = useState(defaultWords);
  // const [layoutData, setLayoutData] = useState<LayoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);
  
  useEffect(() => {
    if (selectedLayer && selectedLayerIndex != 0) {
      const keys = new Set(selectedLayer.flat())
      let shuffledWords: string[] = shuffleWords(Array.from(keys)).filter((word) => word != "KC_LSHIFT" && word != "KC_RSHIFT" && word !== "KC_BSPACE" && word !== "KC_SPACE" && word !== "KC_MUTE").map(word => {
        return getDisplayKeyLabel(word)
      })
      setWords(shuffledWords)
    }
  }, [selectedLayer, selectedLayerIndex]);

  useEffect(() => {
    if (selectedLayout) {
      setSelectedLayer(selectedLayout.layers[selectedLayerIndex] || [])
    }
  }, [selectedLayout, selectedLayerIndex]);

  // Fetch layout data
  useEffect(() => {
    if (!layoutId) return;
    
    setLoading(true);
    fetch(`/api/layouts/${layoutId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.layout) {
          setSelectedLayout(data.layout)
          setSelectedLayerIndex(0)
        } else {
          setError(data.error || "Failed to load layout");
        }
      })
      .catch((err) => {
        console.error("Error fetching layout:", err);
        setError("Failed to load layout");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [layoutId]);

  const [cursorPosition, setCursorPosition] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [incorrectPositions, setIncorrectPositions] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalWordsCompleted, setTotalWordsCompleted] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const sentence = words.join(" ");

  // Update timer and WPM calculation in real-time
  useEffect(() => {
    if (startTime === null || isComplete) return;

    const updateTimerAndWpm = () => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      setElapsedTime(elapsedSeconds);

      if (startTime && totalWordsCompleted > 0) {
        const elapsedMinutes = elapsedSeconds / 60;
        const currentWpm = Math.round(totalWordsCompleted / elapsedMinutes);
        setWpm(currentWpm);
      }
    };

    // Update immediately
    updateTimerAndWpm();

    // Update every second for real-time display
    const interval = setInterval(updateTimerAndWpm, 1000);

    return () => clearInterval(interval);
  }, [startTime, totalWordsCompleted, isComplete]);

  // Format elapsed time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFirstTyping = () => {
    if (startTime === null) {
      setStartTime(Date.now());
    }
  };

  const handleWordComplete = (completedWordCount: number) => {
    if (completedWordCount > 0) {
      setTotalWordsCompleted(prev => prev + completedWordCount);
      setWords(prevWords => {
        const newWords = prevWords.slice(completedWordCount);
        // Check if all words are completed
        if (newWords.length === 0) {
          setIsComplete(true);
        }
        return newWords;
      });
      setCursorPosition(0);
      setTypedLength(0);
      setIncorrectPositions(new Set());
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading layout...</p>
      </div>
    );
  }

  if (error || !selectedLayout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-600 mb-4">{error || "Layout not found"}</p>
        <button
          onClick={() => router.push("/training")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Layouts
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen">
      <div className="mb-4">
        <button
          onClick={() => router.push("/training")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mb-4"
        >
          ← Back to Layouts
        </button>
      </div>

      <h3>Learn to touch type on your own keyboard layout</h3>
      
      {/* Layer selector */}
      {selectedLayout && selectedLayout.layers.length > 0 && (
        <div className="mb-4">
          <label htmlFor="layer-select" className="mr-2 font-semibold">
            Select Layer:
          </label>
          <select
            id="layer-select"
            value={selectedLayerIndex}
            onChange={(e) => setSelectedLayerIndex(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            disabled={isComplete}
          >
            {selectedLayout.layers.map((_, index) => (
              <option key={index} value={index}>
                Layer {index+1}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="mb-4 flex gap-6 text-2xl font-bold">
        <div>Time: {formatTime(elapsedTime)}</div>
        <div>WPM: {wpm}</div>
      </div>

      {!isComplete ? (
        <>
          <div className="w-[30vw] flex justify-start">
            <WordList 
              words={words}
              cursorPosition={cursorPosition} 
              incorrectPositions={incorrectPositions}
            />
          </div>
          <InputField 
            sentence={sentence}
            cursorPosition={cursorPosition}
            typedLength={typedLength}
            incorrectPositions={incorrectPositions}
            onCursorChange={setCursorPosition}
            onTypedLengthChange={setTypedLength}
            onIncorrectPositionsChange={setIncorrectPositions}
            onWordComplete={handleWordComplete}
            onFirstTyping={handleFirstTyping}
          />
        </>
      ) : (
        <div className="w-full max-w-4xl px-4">
          <div className="mb-8 p-6 bg-green-50 rounded-lg border-2 border-green-200">
            <h2 className="text-3xl font-bold text-green-800 mb-4">Congratulations! 🎉</h2>
            <div className="text-xl space-y-2">
              <p>You completed all words!</p>
              <p>Final WPM: <span className="font-bold">{wpm}</span></p>
              <p>Total Time: <span className="font-bold">{formatTime(elapsedTime)}</span></p>
            </div>
          </div>
        </div>
      )}

      {!isComplete && <KeyboardLayout/>}
    </div>
  );
}
