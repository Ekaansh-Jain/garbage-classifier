import { NextResponse } from "next/server";
import { classifyUnified } from "@/lib/classifier";

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
    const res = classifyUnified(image);
    return NextResponse.json(res);
  } catch {
    return NextResponse.json({ error: "Failed to classify" }, { status: 500 });
  }
}
