import { GET_ANIME_COMING_SOON } from "../graphql/animeComingSoon";
import { useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProximosEstrenos() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error, refetch } = useQuery(GET_ANIME_COMING_SOON, {
    variables: { page: currentPage, perPage: 20 },
  });

  if (loading) return <p>Cargando</p>;
  if (error) return <p>Error: {error.message}</p>;

  const anime = data?.Page?.media;
  const pageInfo = data?.Page?.pageInfo;

  if (!anime || anime.length === 0) {
    return <p>No hay próximos estrenos disponibles.</p>;
  }

  const handleCardClick = (animeId) => {
    navigate(`/anime/${animeId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    refetch({ page });
  };

  const totalPages = Math.ceil(pageInfo.total / pageInfo.perPage);

  // Función para generar los botones de paginación
  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5; // Número máximo de botones visibles alrededor de la página actual

    // Siempre mostrar la primera página
    if (currentPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          1
        </button>
      );
    }

    // Agregar puntos suspensivos si hay más páginas antes del rango visible
    if (currentPage > maxVisibleButtons) {
      buttons.push(
        <span key="start-ellipsis" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    // Mostrar botones alrededor de la página actual
    const startPage = Math.max(2, currentPage - 2); // Comienza 2 páginas antes de la actual
    const endPage = Math.min(totalPages - 1, currentPage + 2); // Termina 2 páginas después de la actual

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    // Agregar puntos suspensivos si hay más páginas después del rango visible
    if (currentPage < totalPages - maxVisibleButtons) {
      buttons.push(
        <span key="end-ellipsis" className="px-2 text-gray-500">
          ...
        </span>
      );
    }

    // Siempre mostrar la última página
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === totalPages
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <>
      <div className="p-3 w-[100vw]">
        <h1 className="px-2 pt-2 font-semibold">Próximos Estrenos</h1>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {anime.map((anime) => (
            <div
              key={anime.id}
              className="flex flex-col items-center"
              onClick={() => handleCardClick(anime.id)}
            >
              <img
                src={anime.coverImage.large}
                alt={anime.title.romaji}
                className="aspect-[2/3] rounded-lg"
              />
              <h2>{anime.title.romaji}</h2>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          {/* Botones de paginación */}
          {generatePaginationButtons()}
        </div>
      </div>
    </>
  );
}
