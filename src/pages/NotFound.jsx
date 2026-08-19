import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <span className="material-symbols-outlined text-8xl text-primary/30 mb-4">
        explore_off
      </span>
      <h1 className="text-[64px] font-headline font-extrabold text-on-surface/20 leading-none">
        404
      </h1>
      <h2 className="text-headline-md font-headline font-semibold text-on-surface mb-3">
        Página no encontrada
      </h2>
      <p className="text-body-md text-on-surface-variant mb-8 max-w-md">
        Lo sentimos, la página que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        className="bg-primary hover:bg-primary-container text-on-primary text-label-md font-body font-semibold px-8 py-4 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,182,144,0.3)]"
      >
        <span className="material-symbols-outlined">home</span>
        Volver al inicio
      </Link>
    </div>
  );
}
