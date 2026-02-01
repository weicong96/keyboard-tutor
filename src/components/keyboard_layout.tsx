import { useTraining } from "@/providers/training-provider";
import * as d3 from "d3";
import {useRef, useEffect, useState} from "react";

const td = [
    [
      "KC_A",
      "MO(2)",
      "KC_NO",
      "KC_NO",
      400
    ],
    [
      "KC_O",
      "MO(2)",
      "KC_NO",
      "KC_NO",
      400
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ],
    [
      "KC_NO",
      "KC_NO",
      "KC_NO",
      "KC_NO",
      200
    ]
  ]

const keyLayers = [
    [
      [
        "KC_ESCAPE",
        "KC_1",
        "KC_2",
        "KC_3",
        "KC_4",
        "KC_5",
        -1,
        -1,
        -1,
        "KC_6",
        "KC_7",
        "KC_8",
        "KC_9",
        "KC_0",
        "KC_BSPACE",
        -1
      ],
      [
        "KC_TAB",
        "KC_Q",
        "KC_W",
        "KC_F",
        "KC_P",
        "KC_B",
        "KC_UP",
        -1,
        "KC_LEFT",
        "KC_J",
        "KC_L",
        "KC_U",
        "KC_Y",
        "KC_SCOLON",
        "KC_BSLASH",
        -1
      ],
      [
        "KC_CAPSLOCK",
        "TD(0)",
        "LSFT_T(KC_R)",
        "LGUI_T(KC_S)",
        "LSFT_T(KC_T)",
        "KC_G",
        "KC_DOWN",
        -1,
        "KC_RIGHT",
        "KC_M",
        "RSFT_T(KC_N)",
        "RGUI_T(KC_E)",
        "RCTL_T(KC_I)",
        "TD(1)",
        "HYPR(KC_NO)",
        -1
      ],
      [
        "KC_LSHIFT",
        "KC_Z",
        "KC_X",
        "KC_C",
        "KC_D",
        "KC_V",
        "KC_MUTE",
        -1,
        "KC_TRNS",
        "KC_K",
        "KC_H",
        "KC_COMMA",
        "KC_DOT",
        "KC_SLASH",
        "KC_RSHIFT",
        -1
      ],
      [
        -1,
        -1,
        "KC_LCTRL",
        "KC_LALT",
        "KC_LCTRL",
        "KC_SPACE",
        "MO(1)",
        -1,
        "KC_BSPACE",
        "KC_ENTER",
        "KC_BSPACE",
        "KC_RGUI",
        "KC_RCTRL",
        -1,
        -1,
        -1
      ]
    ],
    [
      [
        "KC_ESCAPE",
        "KC_F1",
        "KC_F2",
        "KC_F3",
        "KC_F4",
        "KC_F5",
        -1,
        -1,
        -1,
        "KC_F6",
        "KC_F7",
        "KC_F8",
        "KC_F9",
        "KC_F10",
        "KC_BSPACE",
        -1
      ],
      [
        "KC_TAB",
        "KC_GRAVE",
        "KC_COMMA",
        "LSFT(KC_DOT)",
        "KC_MINUS",
        "KC_BSLASH",
        "KC_UP",
        -1,
        "KC_LEFT",
        "LSFT(KC_6)",
        "LSFT(KC_LBRACKET)",
        "LSFT(KC_RBRACKET)",
        "LSFT(KC_4)",
        "KC_QUOTE",
        "KC_BSLASH",
        -1
      ],
      [
        "KC_CAPSLOCK",
        "LSFT(KC_1)",
        "LSFT(KC_8)",
        "KC_SLASH",
        "KC_EQUAL",
        "LSFT(KC_7)",
        "KC_DOWN",
        -1,
        "KC_RIGHT",
        "LSFT(KC_3)",
        "LSFT(KC_9)",
        "LSFT(KC_RBRACKET)",
        "LSFT(KC_QUOTE)",
        "KC_SCOLON",
        "KC_ENTER",
        -1
      ],
      [
        "KC_LSHIFT",
        "LSFT(KC_GRAVE)",
        "LSFT(KC_EQUAL)",
        "KC_LBRACKET",
        "KC_RBRACKET",
        "LSFT(KC_5)",
        "KC_MUTE",
        -1,
        "KC_F5",
        "LSFT(KC_2)",
        "LSFT(KC_SCOLON)",
        "KC_DOT",
        "KC_QUOTE",
        "KC_SLASH",
        "KC_RSHIFT",
        -1
      ],
      [
        -1,
        -1,
        "KC_LCTRL",
        "KC_LALT",
        "KC_LGUI",
        "MO(1)",
        "KC_ENTER",
        -1,
        "KC_SPACE",
        "KC_BSPACE",
        "KC_RALT",
        "KC_RGUI",
        "KC_RCTRL",
        -1,
        -1,
        -1
      ]
    ],
    [
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        -1,
        -1,
        "KC_ACL0",
        "KC_ACL1",
        "KC_ACL2",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_MS_U",
        "KC_TRNS",
        "KC_TRNS",
        "KC_VOLU",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_UP",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_MS_L",
        "KC_MS_D",
        "KC_MS_R",
        "KC_TRNS",
        "KC_VOLD",
        -1,
        "KC_MPLY",
        "KC_TRNS",
        "KC_LEFT",
        "KC_DOWN",
        "KC_RIGHT",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_MUTE",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        -1,
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_BTN1",
        "KC_ACL1",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        -1,
        -1
      ]
    ],
    [
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        -1,
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        -1,
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        -1,
        -1
      ]
    ],
    [
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        -1,
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        -1,
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        -1,
        -1
      ]
    ],
    [
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        -1,
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        -1,
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        -1,
        -1
      ]
    ],
    [
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        -1,
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_UP",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_UP",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        -1,
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        -1,
        -1
      ]
    ],
    [
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        -1,
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1
      ],
      [
        -1,
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        "KC_TRNS",
        -1,
        -1,
        -1
      ]
    ]

]
interface KeyboardLayoutProps {
    layoutData?: (string | number)[][][];
    selectedLayer?: number;
}

const KCMappings: Record<string, string> = {
  "LSFT(KC_COMMA)": "<",
  "LSFT(KC_DOT)": ">",
  "LSFT(KC_1)": "!",
  "LSFT(KC_2)": "@",
  "LSFT(KC_3)": "#",
  "LSFT(KC_4)": "$",
  "LSFT(KC_5)": "%",
  "LSFT(KC_6)": "^",
  "LSFT(KC_7)": "&",
  "LSFT(KC_8)": "*",
  "LSFT(KC_9)": "(",
  "LSFT(KC_0)": ")",
  "LSFT(KC_LBRACKET)": "{",
  "LSFT(KC_RBRACKET)": "}",
  "LSFT(KC_SCOLON)": ":",
  "LSFT(KC_BSLASH)": "|",
  "LSFT(KC_SLASH)": "?",
  "LSFT(KC_QUOTE)": "\"",
  "LSFT(KC_GRAVE)": "~",
  "LSFT(KC_MINUS)": "_",
  "LSFT(KC_EQUAL)": "+",
}



export default function KeyboardLayout({ layoutData, selectedLayer = 0 }: KeyboardLayoutProps = {} as KeyboardLayoutProps) {
    const { selectedLayout, setSelectedLayout, mapKeyCodeToKC } = useTraining();
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const keyRectMapRef = useRef<Map<string, d3.Selection<SVGRectElement, unknown, null, undefined>>>(new Map());
    
    // Use provided layoutData or fall back to default keyLayers
    const allLayers = layoutData! || []
    // Get the currently selected layer
    const currentLayer = allLayers[selectedLayer] || allLayers[0] || [];
    // Create a single-layer array for rendering (only the selected layer)
    const activeKeyLayers = [currentLayer];
  
    // Calculate keyboard dimensions (max columns * key width, max rows * key height)
    const keyWidth = 50;
    const keyHeight = 50;
    // Calculate max columns and rows from the current layer
    const maxColumns = currentLayer.length > 0
        ? Math.max(...currentLayer.map(row => row.length))
        : 16;
    const maxRows = currentLayer.length > 0
        ? currentLayer.length
        : 5;
    const baseWidth = maxColumns * keyWidth;
    const baseHeight = maxRows * keyHeight;

    // Update dimensions on window resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth || window.innerWidth * 0.8;
                const containerHeight = containerRef.current.clientHeight || window.innerHeight * 0.4;
                setDimensions({ width: containerWidth, height: containerHeight });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Helper function to extract readable label from key code
    const getKeyLabel = (keyCode: string | number): string => {
        if (keyCode === -1) return "";
        const str = String(keyCode);
        
        if(str.startsWith("LSFT(")) {
          return KCMappings[str.replace("LSFT(", "").replace(")", "")] || KCMappings[str] || str;
        }
        // Extract letter from KC_X format
        if (str.startsWith("KC_")) {
            const letter = str.replace("KC_", "");
            // Handle special cases
            if (letter === "BSPACE") return "⌫";
            if (letter === "SPACE") return "Space";
            if (letter === "ENTER") return "↵";
            if (letter === "TAB") return "Tab";
            if (letter === "ESCAPE") return "Esc";
            if (letter === "CAPSLOCK") return "Caps";
            if (letter === "LSHIFT" || letter === "RSHIFT") return "Shift";
            if (letter === "LCTRL" || letter === "RCTRL") return "Ctrl";
            if (letter === "LALT" || letter === "RALT") return "Alt";
            if (letter === "LGUI" || letter === "RGUI") return "⌘";
            if (letter === "SCOLON") return ";";
            if (letter === "BSLASH") return "\\";
            if (letter === "SLASH") return "/";
            if (letter === "COMMA") return ",";
            if (letter === "DOT") return ".";
            if (letter === "QUOTE") return "'";
            if (letter === "GRAVE") return "`";
            if (letter === "MINUS") return "-";
            if (letter === "EQUAL") return "=";
            if (letter === "LBRACKET") return "[";
            if (letter === "RBRACKET") return "]";
            if (letter === "UP") return "↑";
            if (letter === "DOWN") return "↓";
            if (letter === "LEFT") return "←";
            if (letter === "RIGHT") return "→";
            if (letter === "MUTE") return "🔇";
            if (letter === "VOLU") return "🔊";
            if (letter === "VOLD") return "🔉";
            if (letter === "MPLY") return "⏯";
            if (letter === "TRNS") return "";
            if (letter === "NO") return "";
            // Return single letter if it's a single character
            if (letter.length === 1) return letter.toUpperCase();
            // Return the letter part for things like F1, F2, etc.
            return letter;
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
                    return getKeyLabel(inner);
                }
                return inner;
            }
        }
        
        return str;
    };

    // Keyboard event handlers
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const keyCode = mapKeyCodeToKC(e.key, e.code);
            if (keyCode) {
                console.log('Key pressed:', e.key, e.code, '->', keyCode);
                setPressedKeys(prev => {
                    const newSet = new Set(prev);
                    newSet.add(keyCode);
                    return newSet;
                });
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const keyCode = mapKeyCodeToKC(e.key, e.code);
            if (keyCode) {
                console.log('Key released:', e.key, e.code, '->', keyCode);
                setPressedKeys(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(keyCode);
                    return newSet;
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [mapKeyCodeToKC]);

    // Update rectangle colors based on pressed keys
    useEffect(() => {
        if (!svgRef.current) return;
        
        const svg = d3.select(svgRef.current);
        keyRectMapRef.current.forEach((keyCode) => {
            // Re-select the rectangle by its data attribute to get a fresh reference
            const rect = svg.select(`rect[data-keycode="${keyCode}"]`);
            if (!rect.empty()) {
                const isPressed = pressedKeys.has(keyCode);
                rect.attr("fill", isPressed ? "blueviolet" : "none");
                if (isPressed) {
                    console.log('Highlighting key:', keyCode);
                }
            }
        });
    }, [pressedKeys]);

    useEffect(() => {
        if (!svgRef.current) return;
        
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove(); // Clear previous renders
        keyRectMapRef.current.clear(); // Clear the map

        // Find the actual bounds of the keyboard
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        activeKeyLayers.forEach((layer, layerIndex) => {
            if(layerIndex > 0){
                return
            }
            
            layer.forEach((row, rowIndex) => {
                row.forEach((key, colIndex) => {
                    if (key !== -1) {
                        const x = colIndex * keyWidth;
                        const y = rowIndex * keyHeight;
                        minX = Math.min(minX, x);
                        maxX = Math.max(maxX, x + keyWidth);
                        minY = Math.min(minY, y);
                        maxY = Math.max(maxY, y + keyHeight);
                    }
                });
            });
        });

        // Calculate keyboard center and dimensions
        const keyboardWidth = maxX - minX;
        const keyboardHeight = maxY - minY;
        const keyboardCenterX = (minX + maxX) / 2;
        const keyboardCenterY = (minY + maxY) / 2;

        // Center the viewBox around the keyboard
        const padding = 20;
        const viewBoxWidth = Math.max(keyboardWidth + padding * 2, baseWidth);
        const viewBoxHeight = Math.max(keyboardHeight + padding * 2, baseHeight);
        const viewBoxX = keyboardCenterX - viewBoxWidth / 2;
        const viewBoxY = keyboardCenterY - viewBoxHeight / 2;

        // Update SVG viewBox to center the keyboard
        svg.attr("viewBox", `${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`);

        activeKeyLayers.forEach((layer, layerIndex) => {
            if(layerIndex > 0){
                return
            }
            layer.forEach((row, rowIndex) => {
                row.forEach((key, colIndex) => {
                    if (key !== -1) {
                        const x = colIndex * keyWidth;
                        const y = rowIndex * keyHeight;
                        const centerX = x + keyWidth / 2;
                        const centerY = y + keyHeight / 2;
                        
                        // Extract base key code for mapping (handle function calls)
                        let baseKeyCode = String(key);
                        
                        // Handle TD (tap dance) keys
                        if(baseKeyCode.startsWith("TD")){
                          const match = parseInt(baseKeyCode.match(/\(([^)]+)\)/)?.[1] || '0');
                          baseKeyCode = String(td[match][0])
                        }
                        
                        // Extract KC_ code from function calls like LSFT_T(KC_R), MO(2), etc.
                        if (baseKeyCode.includes("(") && baseKeyCode.includes(")")) {
                            const match = baseKeyCode.match(/KC_\w+/);
                            if (match) {
                                baseKeyCode = match[0];
                            } else {
                                // If no KC_ found, try to extract from inside parentheses
                                const innerMatch = baseKeyCode.match(/\(([^)]+)\)/);
                                if (innerMatch && innerMatch[1].startsWith("KC_")) {
                                    baseKeyCode = innerMatch[1];
                                }
                            }
                        }
                        
                        // Handle numeric keys - convert to KC_X format
                        if (!baseKeyCode.startsWith("KC_") && !baseKeyCode.startsWith("TD")) {
                            // If it's a single digit, convert to KC_X format
                            if (/^\d$/.test(baseKeyCode)) {
                                baseKeyCode = `KC_${baseKeyCode}`;
                            }
                            // If it's a single character letter, convert to KC_X format
                            else if (/^[a-zA-Z]$/.test(baseKeyCode)) {
                                baseKeyCode = `KC_${baseKeyCode.toUpperCase()}`;
                            }
                        }
                        
                        // Add rectangle and store reference
                        const rect = svg.append("rect")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("width", keyWidth)
                            .attr("height", keyHeight)
                            .attr("fill", "none")
                            .attr("stroke", "black")
                            .attr("stroke-width", 2)
                            .attr("data-keycode", baseKeyCode);
                        
                        // Store rectangle reference for highlighting
                        keyRectMapRef.current.set(baseKeyCode, rect);
                        
                        // Add text label
                        let label = getKeyLabel(key);
                        if(label === "TD(0)" || label === "TD(1)") {
                          const match = parseInt(label.match(/\(([^)]+)\)/)?.[1] || '0');
                          label = getKeyLabel(td[match][0])
                        }
                        if (label) {
                            svg.append("text")
                                .attr("x", centerX)
                                .attr("y", centerY)
                                .attr("text-anchor", "middle")
                                .attr("dominant-baseline", "middle")
                                .attr("fill", "#000000")
                                .attr("font-size", "18")
                                .attr("font-family", "system-ui, -apple-system, sans-serif")
                                .attr("font-weight", "600")
                                .style("pointer-events", "none")
                                .style("user-select", "none")
                                .text(label);
                        }
                    }
                });
            });
        });
        
        // Update colors after all rectangles are created
        keyRectMapRef.current.forEach((rect, keyCode) => {
            const isPressed = pressedKeys.has(keyCode);
            rect.attr("fill", isPressed ? "cyan" : "none");
        });
    }, [dimensions, activeKeyLayers, selectedLayer, pressedKeys]);

    return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Keyboard Layout</h1>
        <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            viewBox={`0 0 ${baseWidth} ${baseHeight}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ width: "100%", height: "auto", maxHeight: "500px", overflow: "visible" }}
        />
    </div>
    );
}