import { useQuery } from "@apollo/client/react";
import { GET_ANIME_NOVEDADES } from "../graphql/animebanner";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function BannerNovedades() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_ANIME_NOVEDADES, {
    variables: { page: 1, perPage: 5 },
  });

  const slides = useMemo(
    () => (data?.Page?.media || []).filter((a) => a.bannerImage),
    [data]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback(
    (index) => {
      if (slides.length === 0) return;
      setActiveIndex(((index % slides.length) + slides.length) % slides.length);
    },
    [slides.length]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  // Auto-play slider
  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(goNext, 7000);
    return () => clearInterval(timer);
  }, [slides.length, goNext]);

  if (loading) {
    return (
      <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden bg-surface-dim animate-shimmer" />
    );
  }

  if (error || slides.length === 0) return null;

  const hero = slides[activeIndex];

  return (
    <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden group/banner">
      {/* Slides */}
      {slides.map((anime, index) => (
        <div
          key={anime.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center md:bg-[center_top_-100px] w-full h-full scale-105 transition-transform duration-[10s] ease-out"
            style={{
              backgroundImage: anime.bannerImage
                ? `url(${anime.bannerImage})`
                : anime.coverImage?.large
                ? `url(${anime.coverImage.large})`
                : "none",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent w-full md:w-2/3" />
        </div>
      ))}

      {/* Hero Content */}
      <div className="absolute bottom-0 left-0 w-full px-4 md:px-12 pb-12 md:pb-24 flex flex-col justify-end h-full z-10">
        <div key={hero.id} className="max-w-2xl animate-fade-in">
          {/* Tags */}
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-surface/50 backdrop-blur-md text-on-surface text-caption px-3 py-1 rounded-full border border-outline-variant/40 uppercase tracking-widest font-semibold">
              Novedad
            </span>
            {hero.meanScore && (
              <span className="text-primary text-caption font-bold">
                {hero.meanScore}%
              </span>
            )}
            {hero.episodes && (
              <span className="text-on-surface-variant text-caption">
                {hero.episodes} eps
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-[36px] md:text-[56px] leading-tight font-headline font-extrabold text-on-surface mb-4 drop-shadow-2xl">
            {hero.title?.english || hero.title?.romaji || "Sin título"}
          </h1>

          {/* Description */}
          {hero.description && (
            <p className="text-body-lg text-on-surface-variant mb-8 line-clamp-3 max-w-xl">
              {hero.description.replace(/<[^>]*>/g, "").substring(0, 250)}
              {hero.description.length > 250 ? "..." : ""}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate(`/anime/${hero.id}`)}
              className="bg-primary hover:bg-primary-container text-on-primary text-label-md font-body font-semibold px-8 py-4 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,182,144,0.3)]"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                info
              </span>
              Ver detalles
            </button>
          </div>
        </div>
      </div>

      {/* Prev / Next Controls */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goPrev}
            aria-label="Anterior"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-surface/40 backdrop-blur-md border border-outline-variant/40 text-on-surface opacity-0 group-hover/banner:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-on-primary"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={goNext}
            aria-label="Siguiente"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-surface/40 backdrop-blur-md border border-outline-variant/40 text-on-surface opacity-0 group-hover/banner:opacity-100 transition-opacity duration-300 hover:bg-primary hover:text-on-primary"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((anime, index) => (
              <button
                key={anime.id}
                onClick={() => goTo(index)}
                aria-label={`Ir a la diapositiva ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-6 bg-primary"
                    : "w-1.5 bg-on-surface/40 hover:bg-on-surface/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

