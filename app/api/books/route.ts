import { NextResponse } from "next/server";

type GutendexBook = {
  id: number;
  title: string;
  authors: Array<{ name: string }>;
  subjects?: string[];
  formats: Record<string, string>;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const qRaw = url.searchParams.get("q") || "education";
  const maxResults = Number(url.searchParams.get("maxResults") || 12);

  try {
    const params = new URLSearchParams({
      search: qRaw,
      page: "1",
    });

    const resp = await fetch(`https://gutendex.com/books/?${params.toString()}`);
    if (!resp.ok) {
      return NextResponse.json({ error: `Error ${resp.status}` }, { status: resp.status });
    }

    const data = await resp.json();
    const items: GutendexBook[] = (data.results || []) as GutendexBook[];

    const results = items.slice(0, Math.min(maxResults, items.length)).map((b) => {
      const id = String(b.id);
      const title = b.title || "";
      const authors = (b.authors || []).map((a) => a.name);
      const description = (b.subjects || []).join(" · ");
      const thumbnail = b.formats["image/jpeg"] || undefined;
      const html = b.formats["text/html"] || b.formats["text/html; charset=utf-8"];
      const text = b.formats["text/plain"] || b.formats["text/plain; charset=utf-8"];
      const pdf = b.formats["application/pdf"] || undefined;
      const url = html || text || ""; // contenido para leer embebido
      const pdfUrl = pdf || undefined; // enlace directo al PDF si existe
      return { id, title, description, authors, thumbnail, url, pdfUrl };
    }).filter((r) => r.id && r.title && r.url);

    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
