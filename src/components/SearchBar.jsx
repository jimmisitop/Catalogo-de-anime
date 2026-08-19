import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { SEARCH_ANIME } from "../graphql/searchAnime";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import {
  faMagnifyingGlass,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

library.add(far);

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [input, setInput] = useState(false);
  const { loading, error, data } = useQuery(SEARCH_ANIME, {
    variables: { search, page: 1, perPage: 5 },
    skip: !search,
  });

  return (
    <div className="no-scrollbar max-h-15 sticky top-0 z-100 bg-white dark:bg-gray-900">
      <Navbar menuAbierto={menuAbierto} setMenuAbierto={setMenuAbierto} />
      <div className="flex justify-between max-w-[100vw] no-scrollbar">
        <div className="flex">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className={`text-base m-5 z-10 cursor-pointer transition-all md:hidden block duration-300 ${
              !menuAbierto ? "translate-x-[70vw] shadow-2xl" : "translate-x-0"
            }`}
          >
            {!menuAbierto ? (
              <FontAwesomeIcon icon={faXmark} className="animate-spin" />
            ) : (
              <FontAwesomeIcon icon={faBars} />
            )}
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center">
          {!input && (
            <img
              src="/logo.png"
              alt="Logo"
              className="w-32 h-10 object-contain"
            />
          )}
        </div>
        <form className="z-9 relative flex items-center">
          <input
            className={`rounded-lg h-10 transition-all duration-500 ease-in-out md:block bg-gray-100 dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
              input ? "block z-10 shadow-2xl w-66 opacity-100 pl-5" : "hidden"
            }`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Buscar anime..."
            name="search"
            autoComplete="off"
          />
          <button
            className="text-base m-5 cursor-pointer"
            type="button"
            onClick={() => setInput(!input)}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          {loading && <p>Cargando...</p>}
          {error && <p>Error: {error.message}</p>}

          <div className="w-80 z-10 shadow-xl absolute top-15 bg-[#FEFEFE] dark:bg-gray-800">
            {data &&
              data.Page.media.map((anime) => (
                <div
                  key={anime.id}
                  className="p-2 hover:bg-[#ececec] dark:hover:bg-gray-700 active:bg-[#ececec]"
                >
                  <Link to={`/anime/${anime.id}`} className="flex">
                    <img
                      src={anime.coverImage.large}
                      alt={anime.title.romaji}
                      className="w-18 object-cover aspect-[2/3]"
                    />
                    <div>
                      <h3 className="mx-3 text-sm font-bold">
                        {anime.title.romaji}
                      </h3>
                      <p className="mx-3 text-sm mb-1">
                        {anime.description
                          ? anime.description.substring(0, 100) + "..."
                          : "Sin descripción disponible."}
                      </p>
                      {(() => {
                        let bg = "bg-gray-300";
                        if (anime.averageScore < 40) bg = "bg-red-400";
                        else if (
                          anime.averageScore >= 40 &&
                          anime.averageScore < 70
                        )
                          bg = "bg-yellow-400";
                        else if (anime.averageScore >= 70) bg = "bg-green-400";
                        return (
                          <p
                            className={`mx-3 text-xs rounded-2xl px-2 py-1 text-white font-bold inline-block ${bg}`}
                          >
                            {anime.averageScore}
                          </p>
                        );
                      })()}
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </form>
      </div>
    </div>
  );
}
