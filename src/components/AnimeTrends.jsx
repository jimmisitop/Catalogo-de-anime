import { useQuery } from "@apollo/client/react";
import { GET_ANIME_TRENDS } from "../graphql/animeTrends";
import { loadingArray } from "../utils/constants/utilSkeletonCard";
import AnimeCard from "./AnimeCard";

export default function AnimeTrends() {
  const { loading, error, data } = useQuery(GET_ANIME_TRENDS, {
    variables: { page: 1, perPage: 15 },
  });

  if (error) {
    return (
      <section className="px-4 md:px-12 py-4">
        <p className="text-red-400 text-caption">Error: {error.message}</p>
      </section>
    );
  }

  const animes = data?.Page?.media || [];

  return (
    <section className="mt-10 md:mt-16 px-4 md:px-12">
      {/* Section Header */}
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-headline-md font-headline font-semibold text-on-surface flex items-center gap-3">
          <span className="w-1.5 h-6 bg-primary rounded-full" />
          Animes en tendencia
        </h2>
      </div>

      {/* Horizontal Scroll */}
      <div className="flex overflow-x-auto hide-scrollbar gap-4 md:gap-6 pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x">
        {loading
          ? loadingArray
          : animes.map((anime) => (
              <div key={anime.id} className="w-[200px] md:w-[220px] flex-shrink-0 snap-start">
                <AnimeCard anime={anime} />
              </div>
            ))}
      </div>
    </section>
  );
}
