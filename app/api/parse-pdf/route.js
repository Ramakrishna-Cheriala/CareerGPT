import { NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(req) {
  try {
    console.log("req: " + req);
    const formData = await req.formData();
    const file = formData.get("file");
    console.log(file);

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // console.log("buffer: " + buffer);
    const data = await pdf(buffer);

    return NextResponse.json({ text: data.text });
  } catch (error) {
    console.error("PDF parsing error:", error);
    return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
  }
}
