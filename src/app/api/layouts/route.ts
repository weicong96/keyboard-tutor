import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ensure this route uses Node.js runtime (not Edge) for native module support
export const runtime = 'nodejs';

interface VLLFile {
  version: number;
  uid: number;
  layout: (string | number)[][][];
}

export async function GET() {
  try {
    const layouts = await prisma.keyboardLayout.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Transform the data to include summary information
    const layoutsWithSummary = layouts.map((layout) => ({
      id: layout.id,
      createdAt: layout.createdAt,
      modifiedAt: layout.modifiedAt,
      layers: layout.layers.length,
      totalKeys: layout.layers.reduce(
        (sum, layer) => sum + layer.keys.length,
        0
      ),
    }));

    return NextResponse.json({
      success: true,
      layouts: layoutsWithSummary,
    });
  } catch (error) {
    console.error("Error fetching layouts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch layouts",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: VLLFile = await request.json();

    // Validate the request body
    if (!body.layout || !Array.isArray(body.layout)) {
      return NextResponse.json(
        { error: "Invalid layout data" },
        { status: 400 }
      );
    }

    // Create the keyboard layout with all layers and keys in a transaction
    const keyboardLayout = await prisma.$transaction(async (tx) => {
      // Create the main keyboard layout
      const layout = await tx.keyboardLayout.create({
        data: {},
      });

      // Process each layer
      for (let layerIndex = 0; layerIndex < body.layout.length; layerIndex++) {
        const layerData = body.layout[layerIndex];
        
        // Create the layer
        const layer = await tx.layer.create({
          data: {
            keyboardLayoutId: layout.id,
          },
        });

        // Process each row in the layer
        for (let rowIndex = 0; rowIndex < layerData.length; rowIndex++) {
          const row = layerData[rowIndex];
          
          // Process each key in the row
          for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const keyValue = row[colIndex];
            
            // Convert key value to string (handle -1 as empty)
            let keyString: string;
            if (keyValue === -1) {
              keyString = "EMPTY";
            } else if (typeof keyValue === "number") {
              keyString = keyValue.toString();
            } else {
              keyString = keyValue;
            }

            // Create the key with position information
            await tx.key.create({
              data: {
                key: keyString,
                row: rowIndex,
                column: colIndex,
                layerId: layer.id,
              },
            });
          }
        }
      }

      // Return the created layout with all relations
      return await tx.keyboardLayout.findUnique({
        where: { id: layout.id },
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
    });

    return NextResponse.json(
      {
        success: true,
        layout: {
          id: keyboardLayout.id,
          layers: keyboardLayout.layers.length,
          totalKeys: keyboardLayout.layers.reduce(
            (sum: number, layer: { keys: { length: number }[] }) => sum + layer.keys.length,
            0
          ),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving layout:", error);
    return NextResponse.json(
      {
        error: "Failed to save layout",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

