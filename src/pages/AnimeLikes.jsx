import { useFavorites } from "../hooks/useFavorites.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function AnimeLikes() {
  const { favorites, loading } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-primary/30 mb-4">favorite_border</span>
        <h2 className="text-headline-md font-headline font-semibold text-on-surface mb-3">
          Inicia sesión
        </h2>
        <p className="text-body-md text-on-surface-variant mb-6 max-w-md">
          Para ver tus animes favoritos, necesitas iniciar sesión con tu cuenta.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="px-4 md:px-12 py-8">
        <div className="h-8 w-48 rounded-lg animate-shimmer mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-12 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-1.5 h-6 bg-primary rounded-full" />
        <h1 className="text-headline-md font-headline font-semibold text-on-surface">
          Mis favoritos
        </h1>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] p-6 text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">favorite_border</span>
          <p className="text-body-lg text-on-surface-variant">
            Aún no tienes animes favoritos.
          </p>
          <p className="text-body-md text-on-surface-variant/60 mt-2">
            Explora y guarda los que más te gusten.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {favorites.map((fav) => (
            <div
              key={fav.anime_id}
              onClick={() => navigate(`/anime/${fav.anime_id}`)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-[0px_20px_40px_rgba(0,0,0,0.4)] bg-surface-container-high border border-outline-variant/30 mb-3">
                {fav.anime_image ? (
                  <img
                    src={fav.anime_image}
                    alt={fav.anime_title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-surface-variant text-5xl">image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-on-surface text-sm font-semibold">{fav.anime_title}</span>
                </div>
              </div>
              <h3 className="text-body-md font-body font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                {fav.anime_title}
              </h3>
              {fav.status && (
                <p className="text-caption text-on-surface-variant capitalize">{fav.status}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
