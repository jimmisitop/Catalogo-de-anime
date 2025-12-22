import { useQuery } from "@apollo/client/react";
import { GET_ANIME_SCORE } from "../graphql/animeScore";
import { useNavigate } from "react-router-dom";
import { loadingArray } from "../utils/constants/utilSkeletonCard";

export default function AnimeScore() {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_ANIME_SCORE, {
    variables: { page: 1, perPage: 15 },
  });

  if (error) return <p>Error: {error.message}</p>;

  const anime = data?.Page?.media || [];

  const handleCardClick = (animeId) => {
    navigate(`/anime/${animeId}`);
  };

  return (
    <div className="mb-7">
      <h1 className="text-base font-bold px-2 pt-2">Animes mejor valorados</h1>
      <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[100vw] ml-2 px-2 pt-4 snap-x">
        {loading
          ? loadingArray
          : anime.map((anime) => (
              <div
                key={anime.id}
                className="min-w-48 flex flex-col justify-start snap-start"
                onClick={() => handleCardClick(anime.id)}
              >
                <img
                  src={anime.coverImage.large}
                  alt={anime.title.romaji}
                  className="aspect-[2/3] rounded-lg"
                />
                <h3 className="text-nowrap text-base text-center max-w-[190px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {anime.title.romaji}
                </h3>
              </div>
            ))}
      </div>
    </div>
  );
}
