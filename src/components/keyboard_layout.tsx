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




export default function KeyboardLayout() {
    const { 
      selectedLayout, 
      setSelectedLayout, 
      mapKeyCodeToKC, 
      selectedLayer, 
      setSelectedLayer,
      getDisplayKeyLabel
    } = useTraining();
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const keyRectMapRef = useRef<Map<string, d3.Selection<SVGRectElement, unknown, null, undefined>>>(new Map());
    
    // Get the currently selected layer
    const currentLayer = selectedLayer || [];
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

    // Keyboard event handlers
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const keyCode = mapKeyCodeToKC(e.key, e.code);
            if (keyCode?.keyCode) {
                // console.log('Key pressed:', e.key, e.code, '->', keyCode);
                setPressedKeys(prev => {
                    const newSet = new Set(prev);
                    newSet.add(keyCode.keyCode);
                    return newSet;
                });
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            const keyCode = mapKeyCodeToKC(e.key, e.code);
            if (keyCode?.keyCode) {
                setPressedKeys(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(keyCode.keyCode );
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
                        let label = getDisplayKeyLabel(key);
                        if(label === "TD(0)" || label === "TD(1)") {
                          const match = parseInt(label.match(/\(([^)]+)\)/)?.[1] || '0');
                          label = getDisplayKeyLabel(td[match][0])
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