import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const track = url.searchParams.get("track") || "javascript";
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const candidates = [
    `https://raw.githubusercontent.com/exercism/${track}/main/exercises/practice/${id}/README.md`,
    `https://raw.githubusercontent.com/exercism/${track}/main/exercises/concept/${id}/README.md`,
  ];

  try {
    let md: string | null = null;
    for (const cand of candidates) {
      try {
        const resp = await fetch(cand);
        if (!resp.ok) continue;
        const txt = await resp.text();
        if (txt && txt.length > 0) {
          md = txt;
          break;
        }
      } catch {}
    }
    if (!md) {
      return NextResponse.json({ error: "Exercise README not found" }, { status: 404 });
    }
    return NextResponse.json({ md });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

