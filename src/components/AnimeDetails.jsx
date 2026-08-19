import DOMPurify from "dompurify";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_ANIME_DETAIL } from "../graphql/animeDetails";
import StreamingLinks from "./StreamingLinks";
import AnimeRecommendations from "./AnimeRecommendations";
import { useEffect, useState } from "react";
import { useFavorites } from "../hooks/useFavorites.js";
import { useAuth } from "../hooks/useAuth.js";

export default function AnimeDetails() {
  const navigate = useNavigate();
  const [reviewsToShow, setReviewsToShow] = useState(7);
  const [moreDescription, setMoreDescription] = useState(false);
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    function handleResize() {
      if (innerWidth >= 1024) setReviewsToShow(12);
      else if (innerWidth >= 640) setReviewsToShow(9);
      else setReviewsToShow(7);
    }
    handleResize();
    addEventListener("resize", handleResize);
    return () => removeEventListener("resize", handleResize);
  }, []);

  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_ANIME_DETAIL, {
    variables: { id: Number(id) },
  });

  // ── Loading State ──
  if (loading) {
    return (
      <div className="w-full">
        <div className="relative w-full h-[60vh] md:h-[80vh] bg-surface-dim animate-shimmer" />
        <div className="px-4 md:px-12 -mt-20 relative z-10">
          <div className="glass-panel rounded-xl p-6 animate-shimmer h-48" />
        </div>
      </div>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
        <p className="text-error text-body-lg font-semibold mb-2">Error al cargar el anime</p>
        <p className="text-on-surface-variant text-body-md">{error.message}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-primary text-on-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary-container transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const anime = data.Media;
  if (!anime) return null;

  const favorite = isFavorite(anime.id);
  const showMoreDescription = () => setMoreDescription(!moreDescription);

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("Debes iniciar sesión para agregar favoritos");
      return;
    }
    await toggleFavorite(anime);
  };

  const trailerUrl =
    anime.trailer?.id && anime.trailer.site?.toLowerCase() === "youtube"
      ? `https://www.youtube.com/embed/${anime.trailer.id}?rel=0`
      : null;

  const statusLabel =
    anime.status === "FINISHED"
      ? "Finalizado"
      : anime.status === "RELEASING"
      ? "En emisión"
      : anime.status === "NOT_YET_RELEASED"
      ? "Próximamente"
      : anime.status;

  const statusDot =
    anime.status === "RELEASING"
      ? "bg-green-400 animate-pulse"
      : anime.status === "FINISHED"
      ? "bg-primary"
      : "bg-yellow-400";

  return (
    <>
      {/* ── Hero Header ── */}
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-surface-dim">
        {/* Banner Image */}
        {anime.bannerImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${anime.bannerImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-surface-container-high" />
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent hidden md:block" />

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-variant/20"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full px-4 md:px-12 pb-8 md:pb-[120px] z-10 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-3">
            {anime.averageScore && (
              <>
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span className="text-headline-md font-headline text-on-surface">
                  {(anime.averageScore / 10).toFixed(1)}
                </span>
                <span className="text-on-surface-variant text-body-md ml-1">
                  ({anime.averageScore}%)
                </span>
              </>
            )}
          </div>

          <h1 className="text-[32px] md:text-[56px] font-headline font-extrabold text-on-surface mb-4 max-w-3xl leading-tight">
            {anime.title?.romaji}
          </h1>

          <p className="text-body-lg font-body text-on-surface-variant max-w-2xl mb-6 line-clamp-3">
            {anime.description
              ? anime.description.replace(/<[^>]*>/g, "").substring(0, 300)
              : "Sin descripción disponible."}
            {anime.description && anime.description.length > 300 ? "..." : ""}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleToggleFavorite}
              className={`font-label-md text-label-md px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-xl ${
                favorite
                  ? "bg-red-500 text-white"
                  : "bg-primary hover:bg-primary-container text-on-primary"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {favorite ? "favorite" : "favorite_border"}
              </span>
              {favorite ? "En favoritos" : "Agregar a favoritos"}
            </button>
          </div>
        </div>
      </section>

      {/* ── Info Panel (overlapping grid) ── */}
      <section className="relative z-20 px-4 md:px-12 -mt-6 md:-mt-[80px]">
        <div className="glass-panel rounded-xl shadow-[0px_20px_40px_rgba(0,0,0,0.4)] p-5 md:p-6 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {/* Genres */}
          <div className="flex flex-col gap-1">
            <span className="text-caption text-on-surface-variant uppercase tracking-wider">
              Géneros
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {anime.genres?.slice(0, 4).map((genre) => (
                <span
                  key={genre}
                  className="bg-surface-container text-on-surface text-caption px-2 py-1 rounded-lg"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Studio */}
          <div className="flex flex-col gap-1">
            <span className="text-caption text-on-surface-variant uppercase tracking-wider">
              Estudio
            </span>
            <span className="text-body-md text-on-surface font-medium">
              {anime.studios?.nodes?.[0]?.name || "N/A"}
            </span>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <span className="text-caption text-on-surface-variant uppercase tracking-wider">
              Estado
            </span>
            <span className="text-body-md text-primary font-medium flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${statusDot}`} />
              {statusLabel}
            </span>
          </div>

          {/* Episodes */}
          <div className="flex flex-col gap-1">
            <span className="text-caption text-on-surface-variant uppercase tracking-wider">
              Episodios
            </span>
            <span className="text-body-md text-on-surface font-medium">
              {anime.episodes || "N/A"}
            </span>
          </div>
        </div>
      </section>

      {/* ── Full Description ── */}
      <section className="px-4 md:px-12 py-8">
        <div className="max-w-4xl">
          {anime.description && (
            <div className="text-body-md text-on-surface-variant leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    moreDescription
                      ? anime.description
                      : anime.description.slice(0, 600)
                  ),
                }}
              />
              {anime.description.length > 600 && (
                <button
                  onClick={showMoreDescription}
                  className="text-primary hover:underline text-label-md font-semibold mt-3 transition-colors"
                >
                  {moreDescription ? "Ver menos" : "Ver más"}
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Streaming Links ── */}
      {anime.id && (
        <section className="px-4 md:px-12 py-4">
          <StreamingLinks animeId={anime.id} />
        </section>
      )}

      {/* ── Trailer ── */}
      {trailerUrl && (
        <section className="px-4 md:px-12 py-8 bg-surface-container-lowest">
          <h3 className="text-headline-md font-headline font-semibold text-on-surface mb-6">
            Trailer oficial
          </h3>
          <div className="relative w-full max-w-4xl mx-auto aspect-video bg-surface-container rounded-xl overflow-hidden shadow-[0px_20px_40px_rgba(0,0,0,0.4)] border border-outline-variant/30">
            <iframe
              width="100%"
              height="100%"
              src={trailerUrl}
              title="Trailer oficial"
              className="rounded-xl"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {/* ── Reviews ── */}
      {anime.reviews?.nodes?.length > 0 && (
        <section className="px-4 md:px-12 py-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-headline-md font-headline font-semibold text-on-surface">
              Reseñas de la comunidad
            </h3>
          </div>
          <div className="max-w-4xl space-y-6">
            {anime.reviews.nodes.slice(0, reviewsToShow).map((r) => (
              <div key={r.id} className="glass-panel p-5 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-bold text-sm">
                    {r.user?.name?.[0] || "?"}
                  </div>
                  <div>
                    <span className="text-label-md font-body font-semibold text-on-surface">
                      {r.user?.name || "Anónimo"}
                    </span>
                    {r.rating && (
                      <span className="ml-3 text-caption text-primary font-semibold">
                        ★ {r.rating}
                      </span>
                    )}
                  </div>
                </div>
                {r.summary && (
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {r.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Recommendations ── */}
      <section className="px-4 md:px-12 py-8">
        <AnimeRecommendations animeId={anime.id} />
      </section>
    </>
  );
}
