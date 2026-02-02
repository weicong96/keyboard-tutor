"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Layout {
  id: string;
  createdAt: string;
  modifiedAt: string;
  layers: string[][][];
  totalKeys: number;
}

interface TrainingContextType {
  layouts: Layout[];
  loadingLayouts: boolean;
  refreshLayouts: () => void;
  selectedLayout: Layout | null;
  setSelectedLayout: (layout: Layout | null) => void;
  // what to show on input field
  getDisplayKeyLabel: (keyCode: string | number) => string;
  // what to show on keyboard layout
  mapKeyCodeToKC: (key: string, code: string) => {keyCode: string, displayKey: string} | null;
  // selected layer
  selectedLayer: string[][] | null;
  setSelectedLayer: (layer: string[][] | null) => void;
}
  const keyCodeToKey: Record<string, Record<string, string>> = {
    'KC_ESCAPE': {keyCode: 'Escape', displayKey: 'Esc'},
    'KC_TAB': {keyCode: 'Tab', displayKey: 'Tab'},
    'KC_CAPSLOCK': {keyCode: 'CapsLock', displayKey: 'Caps'},
    'KC_LSHIFT': {keyCode: 'ShiftLeft', displayKey: 'Shift'},
    'KC_RSHIFT': {keyCode: 'ShiftRight', displayKey: 'Shift'},
    'KC_LCTRL': {keyCode: 'ControlLeft', displayKey: 'Ctrl'},
    'KC_RCTRL': {keyCode: 'ControlRight', displayKey: 'Ctrl'},
    "KC_F1" : {keyCode: 'F1', displayKey: 'F1'},
    "KC_F2": {keyCode: 'F2', displayKey: 'F2'},
    "KC_F3": {keyCode: 'F3', displayKey: 'F3'},
    "KC_F4": {keyCode: 'F4', displayKey: 'F4'},
    "KC_F5": {keyCode: 'F5', displayKey: 'F5'},
    "KC_F6": {keyCode: 'F6', displayKey: 'F6'},
    "KC_F7": {keyCode: 'F7', displayKey: 'F7'},
    "KC_F8": {keyCode: 'F8', displayKey: 'F8'},
    "KC_F9": {keyCode: 'F9', displayKey: 'F9'},
    "KC_F10": {keyCode: 'F10', displayKey: 'F10'},
    'KC_LALT': {keyCode: 'AltLeft', displayKey: 'Alt'},
    'KC_RALT': {keyCode: 'AltRight', displayKey: 'Alt'},
    'KC_LGUI': {keyCode: 'MetaLeft', displayKey: 'Meta'},
    'KC_RGUI': {keyCode: 'MetaRight', displayKey: 'Meta'},
    'KC_SPACE': {keyCode: 'Space', displayKey: 'Space'},
    'KC_ENTER': {keyCode: 'Enter', displayKey: '↵'},
    'KC_BSPACE': {keyCode: 'Backspace', displayKey: '⌫'},
    'KC_UP': {keyCode: 'ArrowUp', displayKey: '↑'},
    'KC_DOWN': {keyCode: 'ArrowDown', displayKey: '↓'},
    'KC_LEFT': {keyCode: 'ArrowLeft', displayKey: '←'},
    'KC_RIGHT': {keyCode: 'ArrowRight', displayKey: '→'},
    'KC_SCOLON': {keyCode: 'Semicolon', displayKey: ';'},
    'KC_EQUAL': {keyCode: 'Equal', displayKey: '='},
    "KC_MUTE": {keyCode: 'Mute', displayKey: '🔇'},
    "KC_TRNS": {keyCode: 'Trans', displayKey: ' '},
    'KC_COMMA': {keyCode: 'Comma', displayKey: ','},
    'KC_MINUS': {keyCode: 'Minus', displayKey: '-'},
    'KC_DOT': {keyCode: 'Period', displayKey: '.'},
    'KC_SLASH': {keyCode: 'Slash', displayKey: '/'},
    'KC_GRAVE': {keyCode: 'Backquote', displayKey: '`'},
    'KC_BSLASH': {keyCode: 'Backslash', displayKey: '\\'},
    'KC_QUOTE': {keyCode: 'Quote', displayKey: "'"},
    'KC_LBRACKET': {keyCode: 'BracketLeft', displayKey: '['},

    'KC_RBRACKET': {keyCode: 'BracketRight', displayKey: ']'},
    "LSFT(KC_COMMA)": {keyCode: '<', displayKey: '<'},
    "LSFT(KC_DOT)": {keyCode: '>', displayKey: '>'},
    "LSFT(KC_1)": {keyCode: '!', displayKey: '!'},
    "LSFT(KC_2)": {keyCode: '@', displayKey: '@'},
    "LSFT(KC_3)": {keyCode: '#', displayKey: '#'},
    "LSFT(KC_4)": {keyCode: '$', displayKey: '$'},
    "LSFT(KC_5)": {keyCode: '%', displayKey: '%'},
    "LSFT(KC_6)": {keyCode: '^', displayKey: '^'},
    "LSFT(KC_7)": {keyCode: '&', displayKey: '&'},
    "LSFT(KC_8)": {keyCode: '*', displayKey: '*'},
    "LSFT(KC_9)": {keyCode: '(', displayKey: '('},
    "LSFT(KC_0)": {keyCode: ')', displayKey: ')'},
    
    "LSFT(KC_LBRACKET)": {keyCode: '{', displayKey: '{'},
    "LSFT(KC_RBRACKET)": {keyCode: '}', displayKey: '}'},
    
    "LSFT(KC_SCOLON)": {keyCode: ':', displayKey: ':'},
    "LSFT(KC_BSLASH)": {keyCode: '|', displayKey: '|'},
    "LSFT(KC_SLASH)": {keyCode: '?', displayKey: '?'},
    "LSFT(KC_QUOTE)": {keyCode: '"', displayKey: '"'},
    "LSFT(KC_GRAVE)": {keyCode: '~', displayKey: '~'},
    "LSFT(KC_MINUS)": {keyCode: '_', displayKey: '_'},
    "LSFT(KC_EQUAL)": {keyCode: '+', displayKey: '+'},
  }
  

const TrainingContext = createContext<TrainingContextType | undefined>(undefined);

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [loadingLayouts, setLoadingLayouts] = useState(false);

  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<string[][] | null>(null);
  
  useEffect(() => {
    if (selectedLayout) {
      setSelectedLayer(selectedLayout.layers[0] || []);
    }
  }, [selectedLayout]);

  const mapKeyCodeToKC = (key: string, code: string): {keyCode: string, displayKey: string} | null => {
    // Handle letters
    if (key.length === 1 && /[a-zA-Z]/.test(key)) {
        return keyCodeToKey[`KC_${key.toUpperCase()}` as keyof typeof keyCodeToKey] ? { 
          keyCode: keyCodeToKey[`KC_${key.toUpperCase()}` as keyof typeof keyCodeToKey].keyCode, 
          displayKey: keyCodeToKey[`KC_${key.toUpperCase()}` as keyof typeof keyCodeToKey].displayKey 
        } : null;
    }
    
    // Handle numbers
    if (/^[0-9]$/.test(key)) {
        return keyCodeToKey[`KC_${key}` as keyof typeof keyCodeToKey] ? { 
          keyCode: keyCodeToKey[`KC_${key}` as keyof typeof keyCodeToKey].keyCode, 
          displayKey: keyCodeToKey[`KC_${key}` as keyof typeof keyCodeToKey].displayKey 
        } : null;
    }

    const matchingKey = Object.keys(keyCodeToKey).find(item => keyCodeToKey[item].keyCode == key);
    return matchingKey ? { 
      keyCode: keyCodeToKey[matchingKey as keyof typeof keyCodeToKey].keyCode, 
      displayKey: keyCodeToKey[matchingKey as keyof typeof keyCodeToKey].displayKey 
    } : null;
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

  const getDisplayKeyLabel = (keyCode: string | number): string => {
      if (keyCode === -1) return "";
      const str = String(keyCode);
      
      if(str.startsWith("LSFT(")) {
        return keyCodeToKey[str]?.displayKey || str;
      }
      
      // move to keycodeToKey
      if (str.startsWith("KC_")) {
          let letter = keyCodeToKey[str]?.displayKey || str.replace("KC_", "");
          
          if (letter.length === 1){
            letter =letter.toUpperCase();
          }

          return letter.replace("KC_", "");
      }
      
      // Handle other formats
      if (str.includes("(") && str.includes(")")) {
          // Extract from function calls like TD(0), LSFT_T(KC_R), etc.
          if(str.startsWith("TD")) {
            return str  
          }
          const match = str.match(/\(([^)]+)\)/);
          if (match) {
              const inner = match[1];
              if (inner.startsWith("KC_")) {
                  return getDisplayKeyLabel(inner);
              }
              return inner;
          }
      }
      
      return str;
  };

  return (
    <TrainingContext.Provider value={{ 
      layouts, 
      loadingLayouts, 
      refreshLayouts, 
      selectedLayout, 
      setSelectedLayout,
      mapKeyCodeToKC, 
      selectedLayer, 
      setSelectedLayer,
      getDisplayKeyLabel,
    }}>
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
