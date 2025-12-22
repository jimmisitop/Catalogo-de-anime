import DOMPurify from "dompurify";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_ANIME_DETAIL } from "../graphql/animeDetails";
import SearchBar from "./SearchBar";
import StreamingLinks from "./StreamingLinks";
import AnimeLikes from "../pages/AnimeLikes";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faHeart, faHeartCrack } from "@fortawesome/free-solid-svg-icons";

export default function AnimeDetails() {
  library.add(faHeart, faHeartCrack);
  const [reviewsToShow, setReviewsToShow] = useState(7);
  const [moreDescription, setMoreDescription] = useState(false);
  const [item, setItem] = useState(null);

  useEffect(() => {
    function handleResize() {
      if (innerWidth >= 1024) {
        setReviewsToShow(12);
      } else if (innerWidth >= 640) {
        setReviewsToShow(9);
      } else {
        setReviewsToShow(7);
      }
    }
    handleResize();
    addEventListener("resize", handleResize);
    return () => removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem("item", JSON.stringify(item));
  }, [item]);

  const { id } = useParams();

  const { data, loading, error } = useQuery(GET_ANIME_DETAIL, {
    variables: { id: Number(id) },
  });

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const anime = data.Media;

  const showMoreDescription = () => {
    setMoreDescription(!moreDescription);
  };

  console.log(item);

  return (
    <>
      <div className="no-scrollbar p-3">
        {/** Aquí esta el banner de la pagina de detalles */}

        <div className="relative w-full h-[550px] mt-1">
          {anime.bannerImage ? (
            <img
              src={anime.bannerImage}
              alt="Banner"
              className="absolute z-0 w-full h-full object-cover rounded-lg shadow-md inset-0"
            />
          ) : (
            <div className="absolute z-0 w-full h-[550px] rounded-lg shadow-md inset-0 bg-blue-200 flex items-center justify-center"></div>
          )}

          {/** Aquí esta la tarjeta de detalles del anime */}

          <div>
            <div className="absolute inset-x-0 bottom-0 z-0 m-2 backdrop-blur-xs bg-white/30 rounded-lg p-4 flex flex-col sm:flex-row items-center">
              <img
                src={anime.coverImage.large}
                alt={anime.title.romaji}
                className="object-cover rounded-lg shadow-md w-28 h-38 mb-2 sm:mb-0 sm:mr-4"
              />
              {/** Aquí van los detalles del anime */}

              <div className="w-auto">
                <h1 className="text-2xl text-center font-bold mb-2 sm:text-left">
                  {anime.title.romaji}
                </h1>
                <div className="flex-wrap flex text-xs bg-blue-300 rounded-lg p-1 mb-2">
                  <p>{anime.type + " |"}</p>
                  <p>{anime.isLicensed ? " Oficial |" : " No oficial |"}</p>
                  <p>{anime.isAdult ? "+18 |" : ""}</p>
                  <p>{anime.genres.slice(0, 3).join(", ") + " |"}</p>
                  <p>
                    {anime.tags
                      .slice(0, 3)
                      .map((tag) => tag.category)
                      .join(", ")}{" "}
                    |
                  </p>
                  <p>
                    {anime.studios.nodes
                      .slice(0, 1)
                      .map((studio) => studio.name)
                      .join(", ")}{" "}
                    |
                  </p>
                </div>
                <div className="text-xs text-center">
                  {anime.description.length >= 600 ? (
                    <div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            moreDescription
                              ? anime.description
                              : anime.description.slice(0, 600)
                          ),
                        }}
                      />
                      <button
                        onClick={showMoreDescription}
                        className="text-blue-500 hover:underline animate-pulse p-2"
                      >
                        {moreDescription ? "Ver menos" : "Ver más"}
                      </button>
                    </div>
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(anime.description),
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mx-3 mt-2 text-nowrap">
        {(() => {
          let color = "text-gray-300";
          if (anime.status === "FINISHED") color = "text-white";
          else if (anime.status === "RELEASING") color = "text-green-500";
          else if (anime.status === "NOT_YET_RELEASED") color = "text-red-500";
          return (
            <p className={`bg-black px-2 rounded-xl ${color}`}>
              {anime.status}
            </p>
          );
        })()}
        <p className="bg-blue-600 text-white px-2 rounded-xl">
          Episodios: {anime.episodes}
        </p>
        {(() => {
          let bg = "bg-gray-300";
          if (anime.averageScore < 40) bg = "bg-red-400";
          else if (anime.averageScore >= 40 && anime.averageScore < 70)
            bg = "bg-yellow-500";
          else if (anime.averageScore >= 70) bg = "bg-green-400";
          return (
            <p className={`rounded-xl px-2 text-white inline-block ${bg}`}>
              Puntuación: {anime.averageScore}
            </p>
          );
        })()}
        <button
          className="rounded-full bg-white text-base"
          onClick={() => setItem(anime.id)}
        >
          <FontAwesomeIcon icon={item === anime.id ? faHeartCrack : faHeart} />
        </button>
      </div>

      <div className="mt-3 p-2">
        <StreamingLinks animeId={anime.id} />
      </div>

      <div>
        <div className="mt-3 relative z-50 p-2">
          <h2 className="text-base font-semibold mt-6 mb-2">Trailer</h2>
          {anime.trailer &&
          anime.trailer.site === "youtube" &&
          anime.trailer.id ? (
            <div className="mb-4">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${anime.trailer.id}`}
                title="YouTube trailer"
                className="rounded-lg shadow-md"
              ></iframe>
            </div>
          ) : (
            <p className="text-gray-500">No hay trailer disponible.</p>
          )}
          <div>
            <h2 className="mt-6 font-semibold text-base">Reseñas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {anime.reviews.nodes.length > 0 ? (
                anime.reviews.nodes.slice(0, reviewsToShow).map((review) => (
                  <div
                    key={review.id}
                    className="border border-gray-300 rounded-lg p-4"
                  >
                    <h3 className="font-semibold mb-2">
                      Puntuación: {review.rating ? review.rating : "N/A"}
                    </h3>
                    <p className="text-sm">
                      {review.summary
                        ? review.summary
                        : "No hay resumen disponible."}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No hay reseñas disponibles.</p>
              )}
            </div>
          </div>
        </div>
        <AnimeLikes animeId={item} />
      </div>
    </>
  );
}
