import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { NavLink } from "react-router-dom";
import { far } from "@fortawesome/free-regular-svg-icons";
import {
  faGithub,
  faTwitter,
  faLinkedin,
  
  
} from "@fortawesome/free-brands-svg-icons";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../hooks/useTheme.js";
import AuthModal from "./auth/AuthModal.jsx";

library.add(far, faGithub, faTwitter, faLinkedin, faMoon, faSun);

export default function Navbar({ menuAbierto, setMenuAbierto }) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      {!menuAbierto && (
        <div
          className="bg-black/15 fixed top-0 left-0 w-full h-full z-10"
          onClick={() => setMenuAbierto(true)}
        ></div>
      )}
      <nav
        className={`top-0 left-0 h-[100vh] w-[70vw] bg-white dark:bg-gray-800 text-black dark:text-white md:translate-x-0 rounded-br-4xl flex-col flex justify-start md:relative absolute transition-all duration-300 ${
          !menuAbierto
            ? "translate-x-0 z-10 shadow-2xl"
            : "-translate-x-full z-10"
        }`}
      >
        <>
          <div className="ml-3 mt-10 flex flex-col w-fit">
            <h1 className="text-lg font-bold">Menu</h1>
            <ul className="mt-3 space-y-5 ml-5">
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive
                      ? "flex gap-3 items-center text-base sm:text-lg active:bg-gray-200 dark:active:bg-gray-700 py-1 px-3 rounded-4xl bg-gray-200 dark:bg-gray-700"
                      : "flex gap-3 items-center text-base sm:text-lg active:bg-gray-200 dark:active:bg-gray-700 py-1 px-3 rounded-4xl"
                  }
                  to="/"
                >
                  <FontAwesomeIcon icon="fa-regular fa-house" />
                  Inicio
                </NavLink>
              </li>
              <li className="flex gap-3 items-center text-base sm:text-lg active:bg-gray-200 dark:active:bg-gray-700 py-1 px-3 rounded-4xl">
                <FontAwesomeIcon icon="fa-regular fa-compass" />
                <NavLink to="/Descubrir">Descubrir</NavLink>
              </li>
              <li className="flex gap-3 items-center text-base sm:text-lg active:bg-gray-200 dark:active:bg-gray-700 py-1 px-3 rounded-4xl">
                <FontAwesomeIcon icon="fa-regular fa-clock" />
                <NavLink to="/Proximos Estrenos">Próximos estrenos</NavLink>
              </li>
            </ul>
          </div>

          <hr className="my-6 border-gray-300 dark:border-gray-600 mx-6" />

          <div className="ml-3 flex flex-col w-fit">
            <h1 className="text-lg font-bold">Librería</h1>
            <ul className="mt-3 space-y-5 ml-5">
              <li className="flex gap-3 items-center text-base sm:text-lg lg:text-lg xl:text-xl active:bg-gray-200 dark:active:bg-gray-700 py-1 px-3 rounded-4xl">
                <FontAwesomeIcon icon="fa-regular fa-bookmark" />
                <a href="#coleccion">Colección</a>
              </li>
              <li className="flex gap-3 items-center text-base sm:text-lg lg:text-lg xl:text-xl active:bg-gray-200 dark:active:bg-gray-700 py-1 px-3 rounded-4xl">
                <FontAwesomeIcon icon="fa-regular fa-heart" />
                <NavLink to="/Me gusta">Me gusta</NavLink>
              </li>
              <li className="flex gap-3 items-center text-base sm:text-lg lg:text-lg xl:text-xl active:bg-gray-200 dark:active:bg-gray-700 py-1 px-3 rounded-4xl">
                <FontAwesomeIcon icon="fa-regular fa-clock" />
                <a href="#historial">Historial</a>
              </li>
            </ul>

            <hr className="my-6 border-gray-300 dark:border-gray-600 mx-6" />

            <div>
              {/* Auth Section */}
              <div className="mb-5">
                {user ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Hola, {user.user_metadata?.full_name || user.email}
                    </p>
                    <button
                      onClick={signOut}
                      className="text-sm bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 px-4 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-800"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Iniciar sesión
                  </button>
                )}
              </div>

              <div>
                {/* Dark mode toggle */}
                <button
                  className="text-2xl bg-blue-300 dark:bg-blue-700 rounded-full p-2 shadow-lg mb-5 hover:bg-blue-400 dark:hover:bg-blue-600 transition-colors"
                  onClick={toggleTheme}
                  aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                >
                  <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
                </button>

                <h1>Sigueme en mis redes sociales!</h1>
                <ul className="mt-2 flex gap-6 text-2xl text-gray-600 dark:text-gray-400">
                  <li className="bg-blue-300 dark:bg-blue-700 p-2 rounded-full hover:animate-pulse active:bg-blue-400 dark:active:bg-blue-600">
                    <a
                      href="https://github.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faGithub} />
                    </a>
                  </li>
                  <li className="bg-blue-300 dark:bg-blue-700 p-2 rounded-full hover:animate-pulse active:bg-blue-400 dark:active:bg-blue-600">
                    <a
                      href="https://twitter.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                  </li>
                  <li className="bg-blue-300 dark:bg-blue-700 p-2 rounded-full hover:animate-pulse active:bg-blue-400 dark:active:bg-blue-600">
                    <a
                      href="https://linkedin.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
