"use client";

import Image from "next/image";
import styles from "./page.module.css";
import WordList from "@/components/wordlist";
import InputField from "@/components/inputfield";
import { useState, useEffect } from "react";

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

export default function Home() {
  const [words, setWords] = useState(defaultWords);
  
  // Shuffle words only on client after mount to avoid hydration mismatch
  useEffect(() => {
    setWords(shuffleWords(defaultWords));
  }, []);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [typedLength, setTypedLength] = useState(0);
  const [incorrectPositions, setIncorrectPositions] = useState<Set<number>>(new Set());
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalWordsCompleted, setTotalWordsCompleted] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const sentence = words.join(" ");

  // Update timer and WPM calculation in real-time
  useEffect(() => {
    if (startTime === null) return;

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
  }, [startTime, totalWordsCompleted]);

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
      setWords(prevWords => prevWords.slice(completedWordCount));
      setCursorPosition(0);
      setTypedLength(0);
      setIncorrectPositions(new Set());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen">

      <h3>Learn to touch type on your own keyboard layout</h3>
      
      <div className="mb-4 flex gap-6 text-2xl font-bold">
        <div>Time: {formatTime(elapsedTime)}</div>
        <div>WPM: {wpm}</div>
      </div>
    
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
    </div>
  );
}
