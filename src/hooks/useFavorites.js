import { useState, useEffect } from "react";
import supabase, { isConfigured, getSupabaseErrorMessage } from "../lib/supabaseClient.js";
import { useAuth } from "../hooks/useAuth.js";

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load user's favorites
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    if (!isConfigured) {
      setError("Supabase no está configurado. Crea el archivo .env con tus credenciales.");
      return;
    }

    setLoading(true);
    setError(null);

    supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error: err }) => {
        if (err) {
          console.error("Error cargando favoritos:", err);
          setError(getSupabaseErrorMessage(err));
        } else {
          setFavorites(data || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error de red cargando favoritos:", err);
        setError("No se pudieron cargar los favoritos. Verifica tu conexión.");
        setLoading(false);
      });
  }, [user]);

  // Check if anime is favorite
  const isFavorite = (animeId) => {
    return favorites.some((fav) => fav.anime_id === animeId);
  };

  // Add to favorites
  const addFavorite = async (anime) => {
    if (!user) return { error: "Debes iniciar sesión" };
    if (!isConfigured) return { error: "Supabase no está configurado" };

    const { data, error: err } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        anime_id: anime.id,
        anime_title: anime.title?.romaji || anime.title?.english,
        anime_image: anime.coverImage?.large,
        anime_score: anime.averageScore,
        status: "planned",
      })
      .select()
      .single();

    if (err) {
      const msg = getSupabaseErrorMessage(err);
      console.error("Error agregando favorito:", err);
      return { error: msg };
    }

    setFavorites((prev) => [data, ...prev]);
    return { data };
  };

  // Remove from favorites
  const removeFavorite = async (animeId) => {
    if (!user) return { error: "Debes iniciar sesión" };
    if (!isConfigured) return { error: "Supabase no está configurado" };

    const { error: err } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("anime_id", animeId);

    if (err) {
      const msg = getSupabaseErrorMessage(err);
      console.error("Error eliminando favorito:", err);
      return { error: msg };
    }

    setFavorites((prev) => prev.filter((fav) => fav.anime_id !== animeId));
    return {};
  };

  // Toggle favorite
  const toggleFavorite = async (anime) => {
    if (isFavorite(anime.id)) {
      return removeFavorite(anime.id);
    }
    return addFavorite(anime);
  };

  // Update status
  const updateStatus = async (animeId, status) => {
    if (!user) return { error: "Debes iniciar sesión" };
    if (!isConfigured) return { error: "Supabase no está configurado" };

    const { data, error: err } = await supabase
      .from("favorites")
      .update({ status })
      .eq("user_id", user.id)
      .eq("anime_id", animeId)
      .select()
      .single();

    if (err) {
      const msg = getSupabaseErrorMessage(err);
      console.error("Error actualizando estado:", err);
      return { error: msg };
    }

    setFavorites((prev) =>
      prev.map((fav) => (fav.anime_id === animeId ? data : fav))
    );
    return { data };
  };

  return {
    favorites,
    loading,
    error,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    updateStatus,
  };
}
