import { useState } from "react";
import { GET_ANIME_LINKS } from "../graphql/animeLinks";
import { useQuery } from "@apollo/client/react";

export default function StreamingLinks({ animeId }) {
  const { data, loading, error } = useQuery(GET_ANIME_LINKS, {
    variables: { id: animeId },
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const links = data?.Media?.streamingEpisodes;

  if (loading) {
    return (
      <div>
        <h3 className="text-headline-md font-headline font-semibold text-on-surface mb-4">
          Episodios
        </h3>
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[280px] animate-shimmer rounded-xl h-52" />
          ))}
        </div>
      </div>
    );
  }

  if (error) return null;

  if (!links || links.length === 0) {
    return (
      <p className="text-on-surface-variant text-body-md">
        No hay enlaces de streaming disponibles.
      </p>
    );
  }

  const maxIndex = Math.max(0, links.length - 2);

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-headline-md font-headline font-semibold text-on-surface">
          Episodios
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface hover:text-primary transition-colors disabled:opacity-30"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(maxIndex, currentIndex + 1))}
            disabled={currentIndex >= maxIndex}
            className="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-on-surface hover:text-primary transition-colors disabled:opacity-30"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 snap-x">
        {links.slice(currentIndex, currentIndex + 4).map((link, i) => (
          <div
            key={i}
            className="flex-none w-[280px] md:w-[320px] snap-start group cursor-pointer"
          >
            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3 shadow-lg bg-surface-container-high">
              {link.thumbnail ? (
                <img
                  src={link.thumbnail}
                  alt={link.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-surface-variant text-5xl">
                    image
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                <div className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-body-md font-body font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                {link.title}
              </h4>
              <p className="text-caption text-on-surface-variant mt-1">
                {link.site}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
