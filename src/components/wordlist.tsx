"use client";
import React, { useRef, useEffect } from "react";

type WordListProps = {
  words?: string[];
  cursorPosition?: number;
  incorrectPositions?: Set<number>;
};

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

const WordList: React.FC<WordListProps> = ({ 
  words = defaultWords, 
  cursorPosition = 0,
  incorrectPositions = new Set()
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  
  // Join words with spaces to create a sentence
  const sentence = words.join(" ");
  
  // Auto-scroll to keep cursor visible
  useEffect(() => {
    if (cursorRef.current && scrollContainerRef.current) {
      const cursorElement = cursorRef.current;
      const container = scrollContainerRef.current;
      
      const cursorLeft = cursorElement.offsetLeft;
      const cursorWidth = cursorElement.offsetWidth;
      const containerWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;
      
      // Check if cursor is outside visible area
      if (cursorLeft < scrollLeft) {
        // Cursor is to the left of visible area
        container.scrollLeft = cursorLeft - 20; // Add some padding
      } else if (cursorLeft + cursorWidth > scrollLeft + containerWidth) {
        // Cursor is to the right of visible area
        container.scrollLeft = cursorLeft + cursorWidth - containerWidth + 20; // Add some padding
      }
    }
  }, [cursorPosition, sentence]);
  
  return (
    <div className="relative w-full">
      <div 
        ref={scrollContainerRef}
        className="p-4 font-mono text-lg text-left h-16 overflow-x-auto overflow-y-hidden whitespace-nowrap scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {sentence.split("").map((char, index) => {
          const isBeforeCursor = index < cursorPosition;
          const isIncorrect = incorrectPositions.has(index);
          const isCursorPosition = index === cursorPosition;
          
          let className = "text-black";
          if (isBeforeCursor && !isIncorrect) {
            className = "text-green-500";
          } else if (isIncorrect) {
            className = "text-red-500";
          }
          
          return (
            <span
              key={index}
              ref={isCursorPosition ? cursorRef : null}
              className={className}
            >
              {char}
            </span>
          );
        })}
      </div>
      {/* Fade effect on the right to indicate more content */}
      <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
    </div>
  );
};

export default WordList;
