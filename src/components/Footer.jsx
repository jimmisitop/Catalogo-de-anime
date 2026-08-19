export default function Footer() {
  return (
    <footer className="w-full py-8 bg-surface-dim border-t border-outline-variant/30 flex flex-col items-center justify-center gap-4 px-4">
      {/* Logo */}
      <div className="text-headline-md font-headline text-on-surface opacity-80 hover:opacity-100 transition-opacity duration-300 font-extrabold tracking-tighter select-none">
        ANIME<span className="text-primary">CATALOG</span>
      </div>

      {/* Links */}
      <div className="flex flex-wrap justify-center gap-6">
        <a
          href="mailto:jaimesalas.trabajo@gmail.com"
          className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300"
        >
          Contacto
        </a>
        <a
          href="https://anilist.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-body-md text-on-surface-variant hover:text-primary transition-colors duration-300"
        >
          AniList
        </a>
      </div>

      {/* Copyright */}
      <p className="text-caption text-on-surface-variant/60 mt-2">
        © {new Date().getFullYear()} AnimeCatalog. Información de{" "}
        <a
          href="https://anilist.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          AniList
        </a>
      </p>
    </footer>
  );
}
