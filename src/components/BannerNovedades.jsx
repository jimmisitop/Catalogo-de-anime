import { useQuery } from "@apollo/client/react";
import { GET_ANIME_NOVEDADES } from "../graphql/animebanner";
import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useMemo } from "react";

export default function BannerNovedades() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_ANIME_NOVEDADES, {
    variables: { page: 1, perPage: 5 },
  });
  const scrollRef = useRef(null);
  const novedades = useMemo(() => data?.Page?.media || [], [data]);

  useEffect(() => {
    if (!scrollRef.current || novedades.length === 0) return;
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % novedades.length;
      const child = scrollRef.current.children[index];
      if (child) {
        scrollRef.current.scrollTo({
          left: child.offsetLeft,
          behavior: "smooth",
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [novedades]);

  if (loading) return <p>Cargando...</p>;
  if (loading || !data?.Page?.media) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCardClick = (animeId) => {
    navigate(`/anime/${animeId}`);
  };

  return (
    <>
      <div className="no-scrollbar mb-7 mt-7">
        <h1 className="text-lg font-bold m-2">Novedades</h1>
        <div
          className="flex gap-2 relative overflow-x-auto no-scrollbar max-w-[100vw] mx-2 snap-x"
          ref={scrollRef}
        >
          {novedades.map((anime) => {
            if (!anime.bannerImage) return null;
            return (
              <div
                key={anime.id}
                className="min-w-[100%] snap-start cursor-pointer relative"
                onClick={() => handleCardClick(anime.id)}
              >
                <img
                  src={anime.bannerImage}
                  alt={anime.title.romaji}
                  className="aspect-[16/9] object-cover rounded-lg shadow-md inset-0"
                />
                <div
                  className="absolute bottom-0 left-0 w-full h-1/4 rounded-b-lg"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)",
                  }}
                />
                <h3 className="absolute bottom-0 left-0 text-white text-lg px-3 py-1">
                  {anime.title.romaji}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
