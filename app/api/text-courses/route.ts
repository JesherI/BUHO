import { NextResponse } from "next/server";

type RawItem = Record<string, unknown>;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") || "";
  const maxResults = Number(url.searchParams.get("maxResults") || 12);
  const baseUrl = process.env.TEXT_COURSES_API_URL;
  const apiKey = process.env.TEXT_COURSES_API_KEY;
  const track = url.searchParams.get("track") || "javascript";
  const useDefault = !baseUrl || baseUrl.length === 0;
  const candidates = useDefault
    ? [
        `https://exercism.org/api/v2/tracks/${track}/exercises`,
        `https://exercism.org/api/v2/tracks/${track}`,
        `https://api.exercism.org/v3/tracks/${track}/exercises`,
      ]
    : [baseUrl];

  try {
    const headers: Record<string, string> = {};
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    let dataUnknown: unknown = null;
    let usedUrl: string | null = null;
    let parsedArray: RawItem[] = [];
    for (const cand of candidates) {
      try {
        const reqUrl = new URL(cand);
        if (!useDefault) {
          if (q) reqUrl.searchParams.set("q", q);
          reqUrl.searchParams.set("limit", String(maxResults));
        }
        const resp = await fetch(reqUrl.toString(), { headers });
        if (!resp.ok) {
          continue;
        }
        const json = (await resp.json()) as unknown;
        const arr = (() => {
          if (Array.isArray(json)) return json as RawItem[];
          if (json && typeof json === "object") {
            const o = json as Record<string, unknown>;
            if (o["exercises"] && typeof o["exercises"] === "object") {
              const ex = o["exercises"] as Record<string, unknown>;
              const practice = Array.isArray(ex["practice"]) ? (ex["practice"] as RawItem[]) : [];
              const concept = Array.isArray(ex["concept"]) ? (ex["concept"] as RawItem[]) : [];
              return [...practice, ...concept];
            }
            const keys = ["courses", "items", "results", "data", "list"];
            for (const k of keys) {
              const v = o[k];
              if (Array.isArray(v)) return v as RawItem[];
            }
          }
          return [];
        })();
        if (arr.length === 0) {
          continue;
        }
        dataUnknown = json;
        parsedArray = arr;
        usedUrl = cand;
        break;
      } catch {
        continue;
      }
    }
    if (!dataUnknown || parsedArray.length === 0) {
      try {
        const gh = await fetch(`https://raw.githubusercontent.com/exercism/${track}/main/config.json`);
        if (gh.ok) {
          const cfg = (await gh.json()) as Record<string, unknown>;
          const exObj = cfg["exercises"] as Record<string, unknown> | undefined;
          const practice = exObj && Array.isArray(exObj["practice"]) ? (exObj["practice"] as RawItem[]) : [];
          const concept = exObj && Array.isArray(exObj["concept"]) ? (exObj["concept"] as RawItem[]) : [];
          parsedArray = [...practice, ...concept];
          usedUrl = "github";
        }
      } catch {}
    }
    if (parsedArray.length === 0) {
      return NextResponse.json({ results: [] });
    }

    const list: RawItem[] = parsedArray;

    const results = list.map((it) => {
      const id = String((it["id"] ?? it["slug"] ?? it["_id"] ?? ""));
      const title = String((it["title"] ?? it["name"] ?? it["slug"] ?? ""));
      const description = String((it["description"] ?? it["summary"] ?? ""));
      const difficulty = String((it["difficulty"] ?? it["level"] ?? ""));
      const thumbnail = (it["thumbnail"] ?? it["image"] ?? undefined) as string | undefined;
      const urlStr = (it["url"] ?? it["link"] ?? undefined) as string | undefined;
      const urlFinal = urlStr
        || ((usedUrl && usedUrl.includes("exercism.org")) || usedUrl === "github") && id ? `https://exercism.org/tracks/${track}/exercises/${id}` : "";
      return { id, title, description, difficulty, thumbnail, url: urlFinal };
    }).filter((r) => r.id && r.title);

    const filtered = q
      ? results.filter((r) =>
          r.title.toLowerCase().includes(q.toLowerCase())
          || (r.description || "").toLowerCase().includes(q.toLowerCase())
        )
      : results;

    return NextResponse.json({ results: filtered });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
