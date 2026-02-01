import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ensure this route uses Node.js runtime (not Edge) for native module support
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ layout_id: string }> }
) {
  try {
    const { layout_id } = await params;
    const layoutId = layout_id;

    if (!layoutId) {
      return NextResponse.json(
        { error: "Layout ID is required" },
        { status: 400 }
      );
    }

    const layout = await prisma.keyboardLayout.findUnique({
      where: { id: layoutId },
      include: {
        layers: {
          include: {
            keys: {
              orderBy: [
                { row: "asc" },
                { column: "asc" },
              ],
            },
          },
        },
      },
    });

    if (!layout) {
      return NextResponse.json(
        { error: "Layout not found" },
        { status: 404 }
      );
    }

    // Transform the data to match the expected format
    // Convert layers and keys to a 3D array format: [layer][row][column]
    const layoutData: (string | number)[][][] = layout.layers.map((layer) => {
      // Find max row and column to create proper structure
      const maxRow = Math.max(...layer.keys.map(k => k.row), -1);
      const maxCol = Math.max(...layer.keys.map(k => k.column), -1);
      
      // Initialize empty array structure
      const layerArray: (string | number)[][] = [];
      for (let row = 0; row <= maxRow; row++) {
        layerArray[row] = [];
        for (let col = 0; col <= maxCol; col++) {
          layerArray[row][col] = -1; // Default to -1 (empty)
        }
      }
      
      // Fill in the keys
      layer.keys.forEach((key) => {
        // Convert "EMPTY" back to -1, numbers back to numbers, keep strings as is
        if (key.key === "EMPTY") {
          layerArray[key.row][key.column] = -1;
        } else if (!isNaN(Number(key.key)) && key.key !== "") {
          layerArray[key.row][key.column] = Number(key.key);
        } else {
          layerArray[key.row][key.column] = key.key;
        }
      });
      
      return layerArray;
    });

    return NextResponse.json({
      success: true,
      layout: {
        id: layout.id,
        createdAt: layout.createdAt,
        modifiedAt: layout.modifiedAt,
        layers: layoutData,
      },
    });
  } catch (error) {
    console.error("Error fetching layout:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch layout",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
