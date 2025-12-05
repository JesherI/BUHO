import { NextResponse } from "next/server";

type GoogleBookItem = {
  id: string;
  volumeInfo?: {
    title?: string;
    description?: string;
    authors?: string[];
    imageLinks?: { thumbnail?: string };
    previewLink?: string;
  };
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const qRaw = url.searchParams.get("q") || "education";
  const maxResults = Number(url.searchParams.get("maxResults") || 12);
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  try {
    const params = new URLSearchParams({
      q: qRaw,
      maxResults: String(Math.min(maxResults, 20)),
    });
    if (apiKey) params.set("key", apiKey);

    const resp = await fetch(`https://www.googleapis.com/books/v1/volumes?${params.toString()}`);
    if (!resp.ok) {
      try {
        const err = await resp.json();
        const msg = err?.error?.message || JSON.stringify(err);
        return NextResponse.json({ error: msg }, { status: resp.status });
      } catch {
        return NextResponse.json({ error: `Error ${resp.status}` }, { status: resp.status });
      }
    }

    const data = await resp.json();
    const items: GoogleBookItem[] = data.items || [];

    const results = items.map((b) => {
      const id = b.id;
      const info = b.volumeInfo || {};
      const title = String(info.title || "");
      const description = String(info.description || "");
      const authors = Array.isArray(info.authors) ? info.authors : [];
      const thumb = info.imageLinks?.thumbnail || undefined;
      const thumbnail = thumb ? thumb.replace("http://", "https://") : undefined;
      const url = info.previewLink || (id ? `https://books.google.com/books?id=${id}` : "");
      return { id, title, description, authors, thumbnail, url };
    }).filter((r) => r.id && r.title);

    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

