import { NextResponse } from "next/server";

type YouTubeItem = {
  id: { playlistId?: string; videoId?: string };
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
    thumbnails?: { high?: { url?: string } };
  };
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";
  const maxResults = Number(url.searchParams.get("maxResults") || 12);
  const apiKey = process.env.YOUTUBE_API_KEY;
  const preferAlt = /^(1|true)$/i.test(url.searchParams.get("alt") || "");
  const defaultChannels = [
    "UC8butISFwT-Wl7EV0hUK0BQ", // freeCodeCamp.org
    "UC4a-Gbdw7vOaccHmFo40b9g", // Khan Academy
  ];
  const envChannels = (process.env.YOUTUBE_CHANNEL_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const channels = envChannels.length ? envChannels : defaultChannels;

  async function fetchViaRss(ignoreQuery = false) {
    try {
      const all: Array<{
        id: string;
        title: string;
        description: string;
        channel: string;
        thumbnail?: string;
        url: string;
        type: "video";
      }> = [];
      for (const channelId of channels) {
        const resp = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
        if (!resp.ok) continue;
        const xml = await resp.text();
        const entries = xml.split("<entry>").slice(1).map((e) => e.split("</entry>")[0]);
        for (const e of entries) {
          const idMatch = e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
          const titleMatch = e.match(/<title>([\s\S]*?)<\/title>/);
          const authorMatch = e.match(/<author>[\s\S]*?<name>([^<]+)<\/name>[\s\S]*?<\/author>/);
          const id = idMatch?.[1] || "";
          const title = (titleMatch?.[1] || "").trim();
          const channel = (authorMatch?.[1] || "").trim();
          if (!id || !title) continue;
          if (!ignoreQuery && query && !title.toLowerCase().includes(query.toLowerCase())) continue;
          all.push({
            id,
            title,
            description: "",
            channel,
            thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
            url: `https://www.youtube.com/watch?v=${id}`,
            type: "video",
          });
          if (all.length >= maxResults) break;
        }
        if (all.length >= maxResults) break;
      }
      if (all.length === 0 && !ignoreQuery) {
        return await fetchViaRss(true);
      }
      return NextResponse.json({ results: all });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  try {
    if (preferAlt || !apiKey) {
      return await fetchViaRss(false);
    }
    const results: Array<{
      id: string;
      title: string;
      description: string;
      channel: string;
      thumbnail?: string;
      url: string;
      type: "playlist" | "video";
    }> = [];

    for (const channelId of channels) {
      const baseParams = {
        key: apiKey,
        part: "snippet",
        channelId,
        maxResults: String(Math.min(maxResults, 20)),
      };
      const attempts: Array<{ type: "playlist" | "video"; q?: string }> = [
        { type: "playlist", q: query || undefined },
        { type: "video", q: query || undefined },
        { type: "video" },
      ];

      let found = 0;
      for (const a of attempts) {
        const params = new URLSearchParams({ ...baseParams, type: a.type });
        if (a.q) params.set("q", a.q);

          const resp = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
          if (!resp.ok) {
            try {
              const errJson = await resp.json();
              const msg = errJson?.error?.message || JSON.stringify(errJson);
              if (msg && /quota/i.test(msg)) {
                // Fallback to RSS when quota exceeded
              return await fetchViaRss(false);
              }
            } catch {}
            continue;
          }
        const data = await resp.json();
        const items: YouTubeItem[] = data.items || [];
        if (!items.length) continue;
        for (const item of items) {
          const id = item.id.playlistId || item.id.videoId || "";
          if (!id) continue;
          results.push({
            id,
            title: item.snippet.title,
            description: item.snippet.description,
            channel: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails?.high?.url,
            url: item.id.playlistId
              ? `https://www.youtube.com/playlist?list=${item.id.playlistId}`
              : `https://www.youtube.com/watch?v=${item.id.videoId}`,
            type: item.id.playlistId ? "playlist" : "video",
          });
        }
        found += items.length;
        if (found >= Math.min(maxResults, 20)) break;
      }
    }

    if (results.length === 0) {
      return await fetchViaRss(false);
    }
    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
