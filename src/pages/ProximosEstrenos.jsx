import { GET_ANIME_COMING_SOON } from "../graphql/animeComingSoon";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AnimeCard from "../components/AnimeCard";

export default function ProximosEstrenos() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error, refetch } = useQuery(GET_ANIME_COMING_SOON, {
    variables: { page: currentPage, perPage: 20 },
  });

  if (loading) {
    return (
      <div className="px-4 md:px-12 py-8">
        <div className="h-8 w-64 rounded-lg animate-shimmer mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl animate-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-error mb-4">error</span>
        <p className="text-error text-body-lg font-semibold">Error: {error.message}</p>
      </div>
    );
  }

  const anime = data?.Page?.media;
  const pageInfo = data?.Page?.pageInfo;

  if (!anime || anime.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">movie_filter</span>
        <p className="text-body-lg text-on-surface-variant">No hay próximos estrenos disponibles.</p>
      </div>
    );
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch({ page });
  };

  const totalPages = Math.ceil(pageInfo.total / pageInfo.perPage);

  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisible = 5;

    if (currentPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-colors text-label-md font-semibold"
        >
          1
        </button>
      );
    }

    if (currentPage > maxVisible) {
      <span key="start-ellipsis" className="px-2 text-on-surface-variant">...</span>;
    }

    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 rounded-lg transition-colors text-label-md font-semibold ${
            currentPage === i
              ? "bg-primary text-on-primary"
              : "bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary"
          }`}
        >
          {i}
        </button>
      );
    }

    if (currentPage < totalPages - maxVisible) {
      buttons.push(
        <span key="end-ellipsis" className="px-2 text-on-surface-variant">...</span>
      );
    }

    if (currentPage < totalPages) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-colors text-label-md font-semibold"
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="px-4 md:px-12 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-1.5 h-6 bg-primary rounded-full" />
        <h1 className="text-headline-md font-headline font-semibold text-on-surface">
          Próximos Estrenos
        </h1>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {anime.map((a) => (
          <AnimeCard key={a.id} anime={a} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-30"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          {generatePaginationButtons()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-lg bg-surface-container-high text-on-surface hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-30"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      )}
    </div>
  );
}
