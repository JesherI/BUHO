"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/sidebar/sidebar";
import ProfileMenu from "../components/profileMenu/profileMenu";
import Navbar from "../components/navbar/navbar";
import OfflineGate from "../components/OfflineGate";

type CourseItem = {
  id: string;
  title: string;
  description: string;
  channel?: string;
  thumbnail?: string;
  url: string;
  type?: "playlist" | "video";
  difficulty?: string;
};

export default function CursosPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<CourseItem[]>([]);
  const [itemsText, setItemsText] = useState<CourseItem[]>([]);
  const [itemsYoutube, setItemsYoutube] = useState<CourseItem[]>([]);
  const [source, setSource] = useState<"youtube" | "text" | "all">("youtube");
  const [track, setTrack] = useState("javascript");
  const [selected, setSelected] = useState<{ item: CourseItem; kind: "youtube" | "text" } | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const debouncedQuery = useMemo(() => query, [query]);

  useEffect(() => {
    const controller = new AbortController();
    const controllerY = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (source === "all") {
          const qpText = new URLSearchParams();
          if (debouncedQuery) qpText.set("q", debouncedQuery);
          qpText.set("track", track);
          const qpYt = new URLSearchParams();
          if (debouncedQuery) qpYt.set("q", debouncedQuery);

          const [respText, respYt] = await Promise.all([
            fetch(`/api/text-courses?${qpText.toString()}`, { signal: controller.signal }),
            fetch(`/api/courses?${qpYt.toString()}`, { signal: controllerY.signal }),
          ]);

          const dataText = await respText.json();
          const dataYt = await respYt.json();

          setItemsText(Array.isArray(dataText?.results) ? dataText.results : []);
          setItemsYoutube(Array.isArray(dataYt?.results) ? dataYt.results : []);

          if (!respText.ok && !respYt.ok) {
            const errText = dataText?.error || `Error ${respText.status}`;
            const errYt = dataYt?.error || `Error ${respYt.status}`;
            setError(`${errText} | ${errYt}`);
          } else {
            setError(null);
          }
        } else {
          const endpoint = source === "youtube" ? "/api/courses" : "/api/text-courses";
          const queryParams = new URLSearchParams();
          if (debouncedQuery) queryParams.set("q", debouncedQuery);
          if (source === "text") queryParams.set("track", track);
          const resp = await fetch(`${endpoint}?${queryParams.toString()}`, { signal: controller.signal });
          const data = await resp.json();
          if (!resp.ok) {
            throw new Error(data?.error || `Error ${resp.status}`);
          }
          setItems(data.results || []);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg);
        setItems([]);
        setItemsText([]);
        setItemsYoutube([]);
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => {
      controller.abort();
      controllerY.abort();
    };
  }, [debouncedQuery, source, track]);

  return (
    <OfflineGate>
      <div className="flex h-screen bg-black text-white overflow-hidden relative">
        <div className={`fixed left-0 top-0 h-full z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        </div>

        <div className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? "md:ml-80" : "ml-0"}`}>
          <div className="fixed top-0 left-0 w-full z-40">
            <Navbar showAuth={false} toggleSidebar={toggleSidebar}>
              <ProfileMenu onProfileClick={() => {}} />
            </Navbar>
          </div>

          <div className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold">Cursos gratuitos</h1>
              </div>

              <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar tema o curso"
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
                    >Ejercicios</button>
                    <button
                      onClick={() => setSource("all")}
                      className={`px-3 py-1.5 rounded-lg border text-xs ${source === "all" ? "bg-gray-800 text-white border-gray-700" : "bg-black/50 text-gray-400 border-gray-800"}`}
                    >Todo</button>
                    {source === "text" && (
                      <select
                        value={track}
                        onChange={(e) => setTrack(e.target.value)}
                        className="px-2 py-1.5 rounded-lg border text-xs bg-black/50 text-gray-300 border-gray-800"
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="csharp">C#</option>
                        <option value="go">Go</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 text-sm text-red-400 bg-red-900/20 border border-red-700/30 rounded-xl px-3 py-2">
                  {source === "youtube" && error.includes("YOUTUBE_API_KEY") ? "Falta configurar YOUTUBE_API_KEY en .env.local" : error}
                </div>
              )}

              {loading && (
                <div className="text-sm text-gray-400">Cargando cursos…</div>
              )}

              {!loading && !error && source !== "all" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...items].sort((a, b) => a.title.localeCompare(b.title)).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected({ item: c, kind: source === "youtube" ? "youtube" : "text" })}
                      className="text-left w-full border border-gray-800/50 rounded-2xl p-3 bg-gray-900/40 hover:bg-gray-900/60 transition-colors"
                    >
                      {c.thumbnail && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={c.thumbnail} alt={c.title} className="w-full h-36 object-cover rounded-xl mb-3" />
                      )}
                      <div className="min-w-0">
                        {source === "youtube" ? (
                          <div className="text-xs text-gray-500 mb-1">{c.channel} • {c.type === "playlist" ? "Playlist" : "Video"}</div>
                        ) : (
                          <div className="text-xs text-gray-500 mb-1">{c.difficulty || "Ejercicios"}</div>
                        )}
                        <h2 className="text-sm font-medium">{c.title}</h2>
                        {c.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 mt-1">{c.description}</p>
                        )}
                      </div>
                    </button>
                  ))}
                  {items.length === 0 && (
                    <div className="text-sm text-gray-400">No se encontraron cursos. Ajusta tu búsqueda.</div>
                  )}
                </div>
              )}

              {!loading && source === "all" && (
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Ejercicios</div>
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
                            <div className="text-xs text-gray-500 mb-1">{c.difficulty || "Ejercicios"}</div>
                            <h2 className="text-sm font-medium">{c.title}</h2>
                            {c.description && (
                              <p className="text-xs text-gray-400 line-clamp-2 mt-1">{c.description}</p>
                            )}
                          </div>
                        </button>
                      ))}
                      {itemsText.length === 0 && (
                        <div className="text-sm text-gray-400">Sin ejercicios para esta búsqueda.</div>
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
                </div>
              )}

              {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/70" onClick={() => setSelected(null)} />
                  <div className="relative w-full max-w-3xl bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-400">
                        {selected.kind === "youtube" ? "YouTube" : "Ejercicios"}
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
                    ) : (
                      <div className="space-y-2 mb-3">
                        <div className="text-xs text-gray-500">{selected.item.difficulty || "Ejercicios"}</div>
                        {selected.item.description && (
                          <div className="text-sm text-gray-300">{selected.item.description}</div>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {selected.item.url && (
                        <a href={selected.item.url} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-600/40 hover:bg-amber-500/30">Abrir en fuente</a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </OfflineGate>
  );
}
