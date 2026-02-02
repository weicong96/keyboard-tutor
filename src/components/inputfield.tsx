"use client";
import { useRef } from "react";
import { useTraining } from "@/providers/training-provider";

type InputFieldProps = {
  sentence: string;
  cursorPosition: number;
  typedLength: number;
  incorrectPositions: Set<number>;
  onCursorChange?: (position: number) => void;
  onTypedLengthChange?: (length: number) => void;
  onIncorrectPositionsChange?: (positions: Set<number>) => void;
  onWordComplete?: (completedWordCount: number) => void;
  onFirstTyping?: () => void;
};

export default function InputField({ 
  sentence, 
  cursorPosition,
  typedLength,
  incorrectPositions,
  onCursorChange,
  onTypedLengthChange,
  onIncorrectPositionsChange,
  onWordComplete,
  onFirstTyping
}: InputFieldProps) {
  const { mapKeyCodeToKC } = useTraining();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const currentValue = input.value;
    const nextCharIndex = typedLength;
    
    // Handle space key
    if (e.key === " ") {
      // Only clear if we're at the end of the sentence or if there are no incorrect positions
      if (nextCharIndex >= sentence.length || incorrectPositions.size === 0) {
        e.preventDefault();
        
        // Calculate how many complete words have been typed
        let completedWordCount = 0;
        if (incorrectPositions.size === 0 && cursorPosition > 0) {
          // Count how many spaces we've correctly typed (which means we've completed that many words)
          let spaceCount = 0;
          for (let i = 0; i < cursorPosition && i < sentence.length; i++) {
            if (sentence[i] === " ") {
              spaceCount++;
            }
          }
          
          // If cursorPosition is at a space or beyond, we've completed spaceCount + 1 words
          // If cursorPosition is at the end, all words are complete
          if (cursorPosition >= sentence.length) {
            // Reached end of sentence, all words are complete
            completedWordCount = sentence.split(" ").length;
          } else if (sentence[cursorPosition] === " ") {
            // Cursor is at a space, we've completed the word before it
            completedWordCount = spaceCount + 1;
          } else if (spaceCount > 0) {
            // We've passed at least one space, so we've completed that many words
            completedWordCount = spaceCount;
          }
        }
        
        // If we've completed words, remove them
        if (completedWordCount > 0 && onWordComplete) {
          onWordComplete(completedWordCount);
          // Clear the input after removing words
          input.value = "";
        } else {
          // Otherwise just clear the input
          input.value = "";
          if (onCursorChange) {
            onCursorChange(0);
          }
          if (onTypedLengthChange) {
            onTypedLengthChange(0);
          }
          if (onIncorrectPositionsChange) {
            onIncorrectPositionsChange(new Set());
          }
        }
      } else {
        // Don't allow space if there are errors
        e.preventDefault();
      }
      return;
    }

    // Handle backspace
    if (e.key === "Backspace") {
      // Let default backspace behavior happen, then update positions
      setTimeout(() => {
        const newLength = input.value.length;
        if (newLength < typedLength) {
          const newIncorrect = new Set(incorrectPositions);
          // Remove incorrect positions that are beyond the new length
          for (let i = newLength; i < typedLength; i++) {
            newIncorrect.delete(i);
          }
          
          if (onTypedLengthChange) {
            onTypedLengthChange(newLength);
          }
          // Update cursor position - it should be the minimum of typedLength and correct characters
          if (onCursorChange) {
            // Count how many correct characters we have up to newLength
            let correctCount = 0;
            for (let i = 0; i < newLength; i++) {
              if (!newIncorrect.has(i)) {
                correctCount++;
              }
            }
            onCursorChange(correctCount);
          }
          if (onIncorrectPositionsChange) {
            onIncorrectPositionsChange(newIncorrect);
          }
        }
      }, 0);
      return;
    }
    
    // Handle regular character input
    if (e.key.length === 1 || mapKeyCodeToKC(e.key, e.code)) {
      e.preventDefault();
      
      // Track first typing to start timer
      if (typedLength === 0 && onFirstTyping) {
        onFirstTyping();
      }
      
      // Don't allow typing beyond the sentence length
      if (nextCharIndex >= sentence.length) {
        return;
      }
      console.log(e.key, e.code, 'e.key, e.code')
      let nextKeyLength = mapKeyCodeToKC(e.key, e.code)?.displayKey?.length || 1;

      const expectedChar = sentence.slice(nextCharIndex, nextCharIndex + nextKeyLength);
      let typedChar = e.key;
      if(mapKeyCodeToKC(e.key, e.code)?.displayKey){
        typedChar = mapKeyCodeToKC(e.key, e.code)?.displayKey || e.key;
        console.log(mapKeyCodeToKC(e.key, e.code), 'mapKeyCodeToKC')
      }
      
      if (expectedChar === typedChar) {
        // Correct character - advance both cursor and typed length
        input.value = currentValue + typedChar;
        if (onTypedLengthChange) {
          onTypedLengthChange(typedLength + nextKeyLength);
        }
        if (onCursorChange) {
          onCursorChange(cursorPosition + nextKeyLength);
        }
        // Remove from incorrect positions if it was there
        const newIncorrect = new Set(incorrectPositions);
        newIncorrect.delete(nextCharIndex);
        if (onIncorrectPositionsChange) {
          onIncorrectPositionsChange(newIncorrect);
        }
      } else {
        // Incorrect character - mark as incorrect, advance typed length but not cursor
        const newIncorrect = new Set(incorrectPositions);
        newIncorrect.add(nextCharIndex);
        if (onIncorrectPositionsChange) {
          onIncorrectPositionsChange(newIncorrect);
        }
        if (onTypedLengthChange) {
          onTypedLengthChange(typedLength + nextKeyLength);
        }
        // Still add the character to input for visual feedback
        input.value = currentValue + typedChar;
      }
    }

    console.info(mapKeyCodeToKC(e.key, e.code), 'key')
  };


  return (
    <div className="w-[30vw]">
    <div> {incorrectPositions.size} errors</div>
      <input
        ref={inputRef}
        type="text"
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
        placeholder=""
        style={{ resize: "none", minWidth: "100px" }}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

