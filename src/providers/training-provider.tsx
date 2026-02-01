"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Layout {
  id: string;
  createdAt: string;
  modifiedAt: string;
  layers: number;
  totalKeys: number;
}

interface TrainingContextType {
  layouts: Layout[];
  loadingLayouts: boolean;
  refreshLayouts: () => void;
  selectedLayout: Layout | null;
  setSelectedLayout: (layout: Layout | null) => void;
  mapKeyCodeToKC: (key: string, code: string) => string | null;
}

  // Handle special keys
  const keyCodeToKC: Record<string, string> = {
    'Escape': 'KC_ESCAPE',
    'Tab': 'KC_TAB',
    'CapsLock': 'KC_CAPSLOCK',
    'ShiftLeft': 'KC_LSHIFT',
    'ShiftRight': 'KC_RSHIFT',
    'ControlLeft': 'KC_LCTRL',
    'ControlRight': 'KC_RCTRL',
    'AltLeft': 'KC_LALT',
    'AltRight': 'KC_RALT',
    'MetaLeft': 'KC_LGUI',
    'MetaRight': 'KC_RGUI',
    'Space': 'KC_SPACE',
    'Enter': 'KC_ENTER',
    'Backspace': 'KC_BSPACE',
    'ArrowUp': 'KC_UP',
    'ArrowDown': 'KC_DOWN',
    'ArrowLeft': 'KC_LEFT',
    'ArrowRight': 'KC_RIGHT',
    'Semicolon': 'KC_SCOLON',
    'Equal': 'KC_EQUAL',
    'Comma': 'KC_COMMA',
    'Minus': 'KC_MINUS',
    'Period': 'KC_DOT',
    'Slash': 'KC_SLASH',
    'Backquote': 'KC_GRAVE',
    'BracketLeft': 'KC_LBRACKET',
    'BracketRight': 'KC_RBRACKET',
    'Backslash': 'KC_BSLASH',
    'Quote': 'KC_QUOTE'
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loadingLayouts, setLoadingLayouts] = useState(false);

  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);
  
  const mapKeyCodeToKC = (key: string, code: string): string | null => {
    // Handle letters
    if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        return `KC_${key.toUpperCase()}`;
    }
    
    // Handle numbers
    if (/^[0-9]$/.test(key)) {
        return `KC_${key}`;
    }
    
    // Handle special keys using the keyCodeToKC mapping
    return keyCodeToKC[code] || keyCodeToKC[key] || null;
  }

  const fetchLayouts = () => {
    setLoadingLayouts(true);
    fetch("/api/layouts")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.layouts) {
          setLayouts(data.layouts);
        }
      })
      .catch((error) => {
        console.error("Error fetching layouts:", error);
      })
      .finally(() => {
        setLoadingLayouts(false);
      });
  };

  useEffect(() => {
    fetchLayouts();
  }, []);

  const refreshLayouts = () => {
    fetchLayouts();
  };

  return (
    <TrainingContext.Provider value={{ layouts, loadingLayouts, refreshLayouts, selectedLayout, mapKeyCodeToKC, setSelectedLayout }}>
      {children}
    </TrainingContext.Provider>
  );
}

export function useTraining() {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error("useTraining must be used within a TrainingProvider");
  }
  return context;
}
