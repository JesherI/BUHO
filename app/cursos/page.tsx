"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/sidebar/sidebar";
import ProfileMenu from "../components/profileMenu/profileMenu";
import Navbar from "../components/navbar/navbar";
import ProfileCard from "../profile/ProfileCard";
import OfflineGate from "../components/OfflineGate";
import { auth } from "../db/firebase";
import { onAuthStateChanged } from "firebase/auth";

type CourseItem = {
  id: string;
  title: string;
  description: string;
  channel?: string;
  thumbnail?: string;
  url: string;
  pdfUrl?: string;
  type?: "playlist" | "video";
  difficulty?: string;
  authors?: string[];
};

type OpenAlexAuthorship = { author?: { display_name?: string } };
type OpenAlexWork = {
  id?: string;
  doi?: string;
  ids?: { openalex?: string; doi?: string };
  display_name?: string;
  authorships?: OpenAlexAuthorship[];
  publication_year?: number;
};

const SpectrumLoader: React.FC = () => (
  <div className="w-full flex flex-col items-center justify-center py-12">
    <div className="flex items-end gap-[3px] px-1 py-1 bg-transparent rounded-xl">
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={`b-${i}`}
          className="w-1.5 rounded-sm"
          style={{
            height: 24,
            background: "linear-gradient(to top,#3f3f46,#9ca3af)",
            animation: `equalize 1.6s ease-in-out ${i * 0.07}s infinite`
          }}
        />
      ))}
    </div>
    <div className="mt-3 text-sm text-gray-400">Cargando…</div>
    <style jsx>{`
      @keyframes equalize {
        0% { transform: scaleY(0.5) }
        25% { transform: scaleY(1.3) }
        50% { transform: scaleY(0.6) }
        75% { transform: scaleY(1.1) }
        100% { transform: scaleY(0.8) }
      }
    `}</style>
  </div>
);

export default function CursosPage() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CourseItem[]>([]);
  const [itemsText, setItemsText] = useState<CourseItem[]>([]);
  const [itemsYoutube, setItemsYoutube] = useState<CourseItem[]>([]);
  const [itemsBooks, setItemsBooks] = useState<CourseItem[]>([]);
  const [source, setSource] = useState<"youtube" | "text" | "books" | "all">("text");
  const [selected, setSelected] = useState<{ item: CourseItem; kind: "youtube" | "text" | "book" } | null>(null);
  const [bookHtml, setBookHtml] = useState<string>("");
  const [bookLoading, setBookLoading] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleProfileClick = () => setShowProfile(true);
  const handleCloseProfile = () => setShowProfile(false);

  const debouncedQuery = useMemo(() => query, [query]);

  const handleDownloadBook = async () => {
    try {
      if (!selected || selected.kind !== "book" || !selected.item.url) return;
      const target = selected.item.pdfUrl || selected.item.url;
      const res = await fetch(`/api/book-content?url=${encodeURIComponent(target)}`);
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Error ${res.status}`);
      }
      const blob = await res.blob();
      const ct = blob.type || res.headers.get("content-type") || "application/octet-stream";
      const nameBase = (selected.item.title || "libro").replace(/[^\w-]+/g, "_").slice(0, 60);
      const ext = selected.item.pdfUrl || ct.includes("pdf") ? "pdf" : ct.includes("epub") ? "epub" : ct.includes("html") ? "html" : ct.includes("text") ? "txt" : "bin";
      const urlObj = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = urlObj;
      a.download = `${nameBase}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(urlObj);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setBookError(msg);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const controllerY = new AbortController();
    const controllerB = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = debouncedQuery || "matemáticas";
        const searchUrl = `https://es.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&origin=*`;
        const fetchWikiSummaries = async () => {
          const resp = await fetch(searchUrl, { signal: controller.signal });
          const data = await resp.json();
          if (!resp.ok) {
            throw new Error(data?.error?.info || `Error ${resp.status}`);
          }
          const results = Array.isArray(data?.query?.search) ? data.query.search.slice(0, 12) : [];
          const summaries = await Promise.all(
            results.map(async (r: { title: string }) => {
              try {
                const sResp = await fetch(`https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(r.title)}`);
                const sData = await sResp.json();
                const title = (sData?.title || r.title) as string;
                const description = (sData?.extract || "") as string;
                const thumbnail = (sData?.thumbnail?.source || undefined) as string | undefined;
                const url = `https://es.wikipedia.org/wiki/${encodeURIComponent(title)}`;
                return { id: title, title, description, thumbnail, url } as CourseItem;
              } catch {
                const title = r.title;
                const url = `https://es.wikipedia.org/wiki/${encodeURIComponent(title)}`;
                return { id: title, title, description: "", url } as CourseItem;
              }
            })
          );
          return summaries;
        };

        if (source === "all") {
          const [wikiItems, ytData, bookData] = await Promise.all([
            fetchWikiSummaries().catch(() => [] as CourseItem[]),
            (async () => {
              const qpYt = new URLSearchParams();
              if (debouncedQuery) qpYt.set("q", debouncedQuery);
              const respYt = await fetch(`/api/courses?${qpYt.toString()}`, { signal: controllerY.signal });
              const dataYt = await respYt.json();
              return respYt.ok && Array.isArray(dataYt?.results) ? (dataYt.results as CourseItem[]) : [];
            })(),
            (async () => {
              const qpBooks = new URLSearchParams();
              qpBooks.set("q", debouncedQuery || "education");
              const respBooks = await fetch(`/api/books?${qpBooks.toString()}`, { signal: controllerB.signal });
              const dataBooks = await respBooks.json();
              return respBooks.ok && Array.isArray(dataBooks?.results) ? (dataBooks.results as CourseItem[]) : [];
            })(),
          ]);
          setItemsText(wikiItems);
          setItemsYoutube(ytData);
          setItemsBooks(bookData);
          if (wikiItems.length === 0 && ytData.length === 0 && bookData.length === 0) {
            setError("Sin resultados para la búsqueda");
          } else {
            setError(null);
          }
        } else if (source === "text") {
          let results = await fetchWikiSummaries().catch(() => [] as CourseItem[]);
          if (results.length === 0) {
            try {
              const oa = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(q)}&per_page=12`, { signal: controller.signal });
              const oaData = await oa.json();
              const works = Array.isArray(oaData?.results) ? (oaData.results as OpenAlexWork[]) : [];
              results = works.map((w: OpenAlexWork) => {
                const id = String(w.id || w.doi || w.ids?.openalex || w.ids?.doi || Math.random());
                const title = String(w.display_name || "");
                const authors = Array.isArray(w.authorships) ? w.authorships.map((a: OpenAlexAuthorship) => a.author?.display_name || "").filter(Boolean) : [];
                const pubYear = w.publication_year ? String(w.publication_year) : "";
                const description = [authors.join(", "), pubYear].filter(Boolean).join(" · ");
                const url = String(w.id || "");
                return { id, title, description, url } as CourseItem;
              }).filter((r: CourseItem) => r.id && r.title);
            } catch {}
          }
          setItems(results);
          if (results.length === 0) {
            setError("Sin contenidos disponibles");
          } else {
            setError(null);
          }
        } else if (source === "youtube") {
          const qpYt = new URLSearchParams();
          if (debouncedQuery) qpYt.set("q", debouncedQuery);
          qpYt.set("alt", "1");
          const respYt = await fetch(`/api/courses?${qpYt.toString()}`, { signal: controllerY.signal });
          const dataYt = await respYt.json();
          if (!respYt.ok) {
            throw new Error(dataYt?.error || `Error ${respYt.status}`);
          }
          setItems(Array.isArray(dataYt?.results) ? dataYt.results : []);
        } else {
          const qpBooks = new URLSearchParams();
          qpBooks.set("q", debouncedQuery || "education");
          const respBooks = await fetch(`/api/books?${qpBooks.toString()}`, { signal: controllerB.signal });
          const dataBooks = await respBooks.json();
          if (!respBooks.ok) {
            throw new Error(dataBooks?.error || `Error ${respBooks.status}`);
          }
          setItems(Array.isArray(dataBooks?.results) ? dataBooks.results : []);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        setItems([]);
        setItemsText([]);
        setItemsYoutube([]);
        setItemsBooks([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      controller.abort();
      controllerY.abort();
      controllerB.abort();
    };
  }, [debouncedQuery, source]);

  useEffect(() => {
    if (selected?.kind === "book" && selected.item.url) {
      const controller = new AbortController();
      const loadBook = async () => {
        setBookLoading(true);
        setBookError(null);
        setBookHtml("");
        try {
          const res = await fetch(`/api/book-content?url=${encodeURIComponent(selected.item.url)}`, { signal: controller.signal });
          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            throw new Error(j?.error || `Error ${res.status}`);
          }
          const text = await res.text();
          const base = selected.item.url.replace(/\/[^/]*$/, "/");
          const srcdoc = `<!doctype html><html><head><base href="${base}"><meta charset="utf-8"><style>body{background:#0b0b0b;color:#e5e5e5;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6;padding:16px} a{color:#f59e0b} img{max-width:100%} h1,h2,h3{color:#fff} pre,code{background:#111;padding:2px 4px;border-radius:6px}</style></head><body>${text}</body></html>`;
          setBookHtml(srcdoc);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          setBookError(msg);
        } finally {
          setBookLoading(false);
        }
      };
      loadBook();
      return () => controller.abort();
    } else {
      setBookHtml("");
      setBookError(null);
      setBookLoading(false);
    }
  }, [selected]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/log-in");
      }
    });
    return () => unsub();
  }, [router]);

  return (
    <OfflineGate>
      <div className="flex h-screen bg-black text-white overflow-hidden relative">
        <div className={`fixed left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </div>

        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "md:ml-80" : "ml-0"}`}>
          <div className="fixed top-0 left-0 w-full z-40">
            <Navbar showAuth={false} toggleSidebar={toggleSidebar}>
              <ProfileMenu onProfileClick={handleProfileClick} />
            </Navbar>
          </div>

          <div className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Contenidos</h1>
              </div>

              <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar tema o contenido"
                  className="w-full bg-black/50 border border-gray-800 rounded-xl px-3 py-2 text-white placeholder-gray-500"
                />
                <div className="sm:col-span-2 text-xs text-gray-500 flex items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSource("youtube")}
                      className={`px-3 py-1.5 rounded-lg border text-xs ${source === "youtube" ? "bg-gray-800 text-white border-gray-700" : "bg-black/50 text-gray-400 border-gray-800"}`}
                    >YouTube</button>
                    <button
                      onClick={() => setSource("text")}
                      className={`px-3 py-1.5 rounded-lg border text-xs ${source === "text" ? "bg-gray-800 text-white border-gray-700" : "bg-black/50 text-gray-400 border-gray-800"}`}
                    >Contenidos</button>
                    <button
                      onClick={() => setSource("books")}
                      className={`px-3 py-1.5 rounded-lg border text-xs ${source === "books" ? "bg-gray-800 text-white border-gray-700" : "bg-black/50 text-gray-400 border-gray-800"}`}
                    >Libros</button>
                    <button
                      onClick={() => setSource("all")}
                      className={`px-3 py-1.5 rounded-lg border text-xs ${source === "all" ? "bg-gray-800 text-white border-gray-700" : "bg-black/50 text-gray-400 border-gray-800"}`}
                    >Todo</button>
                    
                  </div>
                </div>
              </div>

              {error && (
                <SpectrumLoader />
              )}

              {loading && (
                <SpectrumLoader />
              )}

              {!loading && !error && source !== "all" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...items].sort((a, b) => a.title.localeCompare(b.title)).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected({ item: c, kind: source === "youtube" ? "youtube" : source === "text" ? "text" : "book" })}
                      className="text-left w-full border border-gray-800/50 rounded-2xl p-3 bg-gray-900/40 hover:bg-gray-900/60 transition-colors"
                    >
                      {c.thumbnail && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.thumbnail} alt={c.title} className="w-full h-36 object-cover rounded-xl mb-3" />
                      )}
                      <div className="min-w-0">
                        {source === "youtube" ? (
                          <div className="text-xs text-gray-500 mb-1">{c.channel} • {c.type === "playlist" ? "Playlist" : "Video"}</div>
                        ) : source === "text" ? (
                          <div className="text-xs text-gray-500 mb-1">Artículo</div>
                        ) : (
                          <div className="text-xs text-gray-500 mb-1">{(c.authors || []).join(", ") || "Libro"}</div>
                        )}
                        <h2 className="text-base font-medium">{c.title}</h2>
                        {c.description && (
                          <p className="text-sm text-gray-400 line-clamp-3 mt-1">{c.description}</p>
                        )}
                      </div>
                    </button>
                  ))}
                  {items.length === 0 && (
                    <div className="text-sm text-gray-400">No se encontraron contenidos. Ajusta tu búsqueda.</div>
                  )}
                </div>
              )}

              {!loading && source === "all" && (
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Contenidos</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...itemsText].sort((a, b) => a.title.localeCompare(b.title)).map((c) => (
                        <button
                          key={`t-${c.id}`}
                          onClick={() => setSelected({ item: c, kind: "text" })}
                          className="text-left w-full border border-gray-800/50 rounded-2xl p-3 bg-gray-900/40 hover:bg-gray-900/60 transition-colors"
                        >
                          {c.thumbnail && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={c.thumbnail} alt={c.title} className="w-full h-36 object-cover rounded-xl mb-3" />
                          )}
                          <div className="min-w-0">
                            <div className="text-xs text-gray-500 mb-1">Artículo</div>
                            <h2 className="text-base font-medium">{c.title}</h2>
                            {c.description && (
                              <p className="text-sm text-gray-400 line-clamp-3 mt-1">{c.description}</p>
                            )}
                          </div>
                        </button>
                      ))}
                      {itemsText.length === 0 && (
                        <div className="text-sm text-gray-400">Sin contenidos para esta búsqueda.</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-2">Videos</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...itemsYoutube].sort((a, b) => a.title.localeCompare(b.title)).map((c) => (
                        <button
                          key={`y-${c.id}`}
                          onClick={() => setSelected({ item: c, kind: "youtube" })}
                          className="text-left w-full border border-gray-800/50 rounded-2xl p-3 bg-gray-900/40 hover:bg-gray-900/60 transition-colors"
                        >
                          {c.thumbnail && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={c.thumbnail} alt={c.title} className="w-full h-36 object-cover rounded-xl mb-3" />
                          )}
                          <div className="min-w-0">
                            <div className="text-xs text-gray-500 mb-1">{c.channel} • {c.type === "playlist" ? "Playlist" : "Video"}</div>
                            <h2 className="text-sm font-medium">{c.title}</h2>
                            {c.description && (
                              <p className="text-xs text-gray-400 line-clamp-2 mt-1">{c.description}</p>
                            )}
                          </div>
                        </button>
                      ))}
                      {itemsYoutube.length === 0 && (
                        <div className="text-sm text-gray-400">Sin videos para esta búsqueda.</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-2">Libros</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...itemsBooks].sort((a, b) => a.title.localeCompare(b.title)).map((c) => (
                        <button
                          key={`b-${c.id}`}
                          onClick={() => setSelected({ item: c, kind: "book" })}
                          className="text-left w-full border border-gray-800/50 rounded-2xl p-3 bg-gray-900/40 hover:bg-gray-900/60 transition-colors"
                        >
                          {c.thumbnail && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={c.thumbnail} alt={c.title} className="w-full h-36 object-cover rounded-xl mb-3" />
                          )}
                          <div className="min-w-0">
                            <div className="text-xs text-gray-500 mb-1">{(c.authors || []).join(", ") || "Libro"}</div>
                            <h2 className="text-sm font-medium">{c.title}</h2>
                            {c.description && (
                              <p className="text-xs text-gray-400 line-clamp-2 mt-1">{c.description}</p>
                            )}
                          </div>
                        </button>
                      ))}
                      {itemsBooks.length === 0 && (
                        <div className="text-sm text-gray-400">Sin libros para esta búsqueda.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/70" onClick={() => setSelected(null)} />
                  <div className="relative w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-400">
                        {selected.kind === "youtube" ? "Video" : selected.kind === "text" ? "Artículo" : "Libro"}
                      </div>
                      <button onClick={() => setSelected(null)} className="text-xs px-2 py-1 rounded-md border border-gray-700 text-gray-300 hover:bg-gray-800">Cerrar</button>
                    </div>
                    <div className="text-lg font-medium mb-2">{selected.item.title}</div>
                    {selected.kind === "youtube" ? (
                      <div className="aspect-video w-full rounded-xl overflow-hidden mb-3">
                        <iframe
                          src={selected.item.type === "playlist" ? `https://www.youtube.com/embed/videoseries?list=${selected.item.id}` : `https://www.youtube.com/embed/${selected.item.id}`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : selected.kind === "text" ? (
                      <div className="space-y-2 mb-3">
                        <div className="text-sm text-gray-500">Artículo</div>
                        {selected.item.description && (
                          <div className="text-base md:text-lg text-gray-300">{selected.item.description}</div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2 mb-3">
                        {(selected.item.authors || []).length > 0 && (
                          <div className="text-xs text-gray-500">{(selected.item.authors || []).join(", ")}</div>
                        )}
                        {bookLoading && (
                          <div className="text-sm text-gray-400">Cargando libro…</div>
                        )}
                        {bookError && (
                          <div className="text-sm text-red-400 bg-red-900/20 border border-red-700/30 rounded-xl px-3 py-2">{bookError}</div>
                        )}
                        {!bookLoading && !bookError && bookHtml && (
                          <div className="w-full h-[70vh] rounded-xl overflow-hidden mb-3 border border-gray-800">
                            <iframe
                              srcDoc={bookHtml}
                              className="w-full h-full"
                              sandbox=""
                            />
                          </div>
                        )}
                        {selected.item.description && (
                          <div className="text-sm text-gray-300">{selected.item.description}</div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {selected.kind === "youtube" && selected.item.url && (
                        <a href={selected.item.url} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-600/40 hover:bg-amber-500/30">Abrir en fuente</a>
                      )}
                      {selected.kind === "text" && selected.item.url && (
                        <a href={selected.item.url} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-600/40 hover:bg-amber-500/30">Abrir artículo completo</a>
                      )}
                      {selected.kind === "book" && selected.item.url && (
                        <button onClick={handleDownloadBook} className="text-xs px-3 py-1.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-600/40 hover:bg-emerald-500/30">Descargar libro</button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {showProfile && <ProfileCard key={Date.now()} onClose={handleCloseProfile} />}
      </div>
    </OfflineGate>
  );
}
