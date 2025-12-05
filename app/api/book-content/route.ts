import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const u = new URL(request.url);
    const raw = u.searchParams.get("url");
    if (!raw) return NextResponse.json({ error: "Missing url" }, { status: 400 });
    let target: URL;
    try {
      target = new URL(raw);
    } catch {
      return NextResponse.json({ error: "Invalid url" }, { status: 400 });
    }
    // Permitir solo contenido de Gutenberg para seguridad
    if (!/gutenberg\.org$/i.test(target.hostname)) {
      return NextResponse.json({ error: "Host not allowed" }, { status: 400 });
    }

    const resp = await fetch(target.toString());
    if (!resp.ok) {
      return NextResponse.json({ error: `Upstream ${resp.status}` }, { status: resp.status });
    }
    const contentType = resp.headers.get("content-type") || "text/plain";
    const body = await resp.text();

    // Pasar como texto sin modificación
    return new NextResponse(body, {
      status: 200,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

