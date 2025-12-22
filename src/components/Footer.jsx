import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  library.add(faArrowRight);
  return (
    <div className="mt-10">
      <div className="h-70 bg-[rgb(31,42,102)] text-white p-4 text-center">
        <p>
          Esta página es una prueba, no representa una página real y no se
          recaba ningún dato. <br></br> Cualquier me gusta, historial o guardado
          se almacena de forma local en tu dispositivo.
        </p>
        <hr className="my-2" />
        <div className="text-start">
          <h2 className="font-semibold">
            Contacto <FontAwesomeIcon icon="fa-regular fa-envelope-open" />
          </h2>
          <a
            href="mailto:jaimesalas.trabajo@gmail.com"
            className="text-base items-center"
          >
            Click aquí para enviarme un correo{" "}
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>
    </div>
  );
}
