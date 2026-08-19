import { useNavigate } from "react-router-dom";

export default function AnimeCard({ anime, showScore = true }) {
  const navigate = useNavigate();

  if (!anime) return null;

  const handleClick = () => navigate(`/anime/${anime.id}`);

  const scoreColor =
    anime.averageScore >= 70
      ? "bg-green-500/20 text-green-400"
      : anime.averageScore >= 40
      ? "bg-yellow-500/20 text-yellow-400"
      : "bg-red-500/20 text-red-400";

  return (
    <div onClick={handleClick} className="group cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-[0px_20px_40px_rgba(0,0,0,0.4)] bg-surface-container-high border border-outline-variant/30 mb-3">
        <img
          src={anime.coverImage?.large}
          alt={anime.title?.romaji}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Score Badge */}
        {showScore && anime.averageScore && (
          <div className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-sm shadow-md ${scoreColor}`}>
            {anime.averageScore}%
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          {/* Genres tags placeholder */}
          <button
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
            className="w-full bg-primary/90 text-on-primary text-sm font-bold py-2 rounded-lg flex justify-center items-center gap-1 backdrop-blur-sm hover:bg-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">info</span>
            Ver detalles
          </button>
        </div>
      </div>

      {/* Title & Info */}
      <div className="h-12">
        <h3 className="text-body-md font-body font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
          {anime.title?.english || anime.title?.romaji || "Sin título"}
        </h3>
        <p className="text-caption text-on-surface-variant truncate">
          {anime.format || "\u00A0"}
        </p>
      </div>
    </div>
  );
}
