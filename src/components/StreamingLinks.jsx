import { useState } from "react";
import { GET_ANIME_LINKS } from "../graphql/animeLinks";
import { useQuery } from "@apollo/client/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function StreamingLinks({ animeId }) {
  library.add(far);
  const { data, loading, error } = useQuery(GET_ANIME_LINKS, {
    variables: { id: animeId },
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  const sliderLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const sliderRight = () => {
    if (currentIndex < links.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const links = data?.Media?.streamingEpisodes;

  if (loading) return <p>Cargando enlaces de streaming...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!links || links.length === 0) {
    return (
      <p className="text-gray-500">No hay enlaces de streaming disponibles.</p>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="text-base font-semibold">Episodios</h3>
      <div className="relative flex flex-col items-center no-scrollbar snap-x max-w-[100vw] mt-5">
        <div className="flex items-center justify-center w-full">
          <button
            type="button"
            className="bg-gray-400/50 absolute z-2 left-0 rounded-full p-2 m-1 text-white hover:bg-blue-600"
            onClick={sliderLeft}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <ul className="flex list-none gap-2 overflow-x-auto justify-center">
            {links.slice(currentIndex, currentIndex + 2).map((link, id) => (
              <li key={id} className="relative">
                <div className="flex flex-col w-51 h-54 aspect-[16/9] bg-gray-200 p-2 rounded-lg">
                  <img
                    src={link.thumbnail}
                    alt={`Thumbnail ${id + 1}`}
                    className="rounded-lg object-cover"
                  />
                  <h3>{link.title}</h3>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-blue-500 hover:underline text-sm"
                  >
                    Ver en {link.site}
                  </a>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="p-2 m-1 bg-gray-400/50 absolute right-0 text-white rounded-full hover:bg-blue-600"
            onClick={sliderRight}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
}
