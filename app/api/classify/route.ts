import { NextResponse } from "next/server";
import { classifyUnified } from "@/lib/classifier";

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000";
const USE_PYTHON_BACKEND = process.env.USE_PYTHON_BACKEND === "true";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image } = body as { image?: string };
    if (
      !image ||
      typeof image !== "string" ||
      !image.startsWith("data:image/")
    ) {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }

    // Use Python backend if enabled, otherwise fall back to mock classifier
    if (USE_PYTHON_BACKEND) {
      console.log("🐍 Using Python backend at:", PYTHON_API_URL);
      try {
        const response = await fetch(`${PYTHON_API_URL}/classify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || `Python API error: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Got prediction from Python backend:", result.top);
        return NextResponse.json(result);
      } catch (error) {
        console.error("❌ Python backend error:", error);
        // Fall back to mock classifier if Python backend fails
        console.log("⚠️  Falling back to mock classifier");
        const res = classifyUnified(image);
        return NextResponse.json(res);
      }
    }

    // Use mock classifier
    console.log("🎭 Using mock classifier (Python backend disabled)");
    const res = classifyUnified(image);
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ error: "Failed to classify" }, { status: 500 });
  }
}
