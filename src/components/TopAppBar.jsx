import { useState, useRef, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { SEARCH_ANIME } from "../graphql/searchAnime";
import { Link } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

export default function TopAppBar() {
  const { toggle } = useSidebar();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  const { loading, data } = useQuery(SEARCH_ANIME, {
    variables: { search, page: 1, perPage: 5 },
    skip: !search,
  });

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearch("");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <>
      {/* ── Top App Bar ── */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-[25px] border-b border-outline-variant/30 shadow-xl">
        <div className="flex justify-between items-center px-4 md:px-12 h-16 w-full">
          {/* Hamburger Menu */}
          <button
            onClick={toggle}
            className="text-primary hover:text-primary-container transition-colors duration-300 p-2 rounded-full hover:bg-surface-variant/20 active:scale-95"
            aria-label="Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          {/* Logo */}
          <Link to="/" className="text-headline-md font-headline font-extrabold tracking-tighter text-primary select-none">
            ANIME<span className="text-primary-container">CATALOG</span>
          </Link>

          {/* Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="text-primary hover:text-primary-container transition-colors duration-300 p-2 rounded-full hover:bg-surface-variant/20 active:scale-95"
            aria-label="Buscar"
          >
            <span className="material-symbols-outlined">
              {searchOpen ? "close" : "search"}
            </span>
          </button>
        </div>
      </header>

      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[55] bg-background/80 backdrop-blur-sm pt-16 animate-fade-in"
          onClick={() => { setSearchOpen(false); setSearch(""); }}
        >
          <div
            className="max-w-2xl mx-auto px-4 pt-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="glass-panel rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant">search</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar anime..."
                  className="flex-1 bg-transparent text-on-surface placeholder-on-surface-variant text-body-md font-body outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search Results */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            )}

            {data && data.Page.media.length > 0 && (
              <div className="space-y-2">
                {data.Page.media.map((anime) => (
                  <Link
                    key={anime.id}
                    to={`/anime/${anime.id}`}
                    onClick={() => { setSearchOpen(false); setSearch(""); }}
                    className="flex gap-4 p-3 rounded-xl hover:bg-surface-container transition-colors duration-200 group"
                  >
                    <img
                      src={anime.coverImage.large}
                      alt={anime.title.romaji}
                      className="w-14 aspect-[2/3] object-cover rounded-lg shadow-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-body-md font-body font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                        {anime.title.romaji}
                      </h3>
                      <p className="text-caption text-on-surface-variant mt-1 line-clamp-2">
                        {anime.description
                          ? anime.description.substring(0, 120).replace(/<[^>]*>/g, "") + "..."
                          : "Sin descripción disponible."}
                      </p>
                      {anime.averageScore && (
                        <span className={`inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          anime.averageScore >= 70 ? "bg-green-500/20 text-green-400" :
                          anime.averageScore >= 40 ? "bg-yellow-500/20 text-yellow-400" :
                          "bg-red-500/20 text-red-400"
                        }`}>
                          {anime.averageScore}%
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {search && data && data.Page.media.length === 0 && !loading && (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl mb-4 block opacity-40">search_off</span>
                <p className="text-body-md">No se encontraron resultados para "{search}"</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
