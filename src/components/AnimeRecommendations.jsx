import { useQuery } from "@apollo/client/react";
import { GET_ANIME_RECOMMENDATIONS } from "../graphql/animeRecommendations";
import AnimeCard from "./AnimeCard";

export default function AnimeRecommendations({ animeId }) {
  const { loading, error, data } = useQuery(GET_ANIME_RECOMMENDATIONS, {
    variables: { id: animeId },
    skip: !animeId,
  });

  if (loading || error || !data?.Media?.recommendations?.nodes?.length) {
    return null;
  }

  const recommendations = data.Media.recommendations.nodes
    .map((n) => n.mediaRecommendation)
    .filter(Boolean)
    .slice(0, 6);

  if (recommendations.length === 0) return null;

  return (
    <div>
      <h3 className="text-headline-md font-headline font-semibold text-on-surface flex items-center gap-3 mb-6">
        <span className="w-1.5 h-6 bg-primary rounded-full" />
        Recomendados
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {recommendations.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} showScore={false} />
        ))}
      </div>
    </div>
  );
}
