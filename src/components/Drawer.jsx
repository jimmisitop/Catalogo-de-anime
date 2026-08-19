import { NavLink } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../hooks/useAuth.js";
import { useTheme } from "../hooks/useTheme.js";
import AuthModal from "./auth/AuthModal.jsx";
import { useState } from "react";

export default function Drawer() {
  const { isOpen, close } = useSidebar();
  const { user, signOut, isSupabaseConfigured } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navLinks = [
    { to: "/", icon: "home", label: "Inicio" },
    { to: "/Proximos Estrenos", icon: "new_releases", label: "Próximos estrenos" },
    { to: "/Me gusta", icon: "favorite", label: "Me gusta" },
  ];

  const secondaryLinks = [
    { icon: ".", label: "GitHub", href: "https://github.com/jimmisitop" },
    { icon: "alternate_email", label: "Twitter", href: "https://x.com/jimmi24_" },
    { icon: "linked_camera", label: "LinkedIn", href: "www.linkedin.com/in/jimmy-24-" },
  ];

  return (
    <>
      {/* ── Overlay ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
          onClick={close}
        />
      )}

      {/* ── Drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-[60] flex flex-col py-6 bg-surface-container h-full w-80 rounded-r-xl shadow-[0px_20px_40px_rgba(0,0,0,0.4)] transform transition-transform duration-300 ease-in-out border-r border-outline-variant/30 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="px-6 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-headline font-bold text-lg">
            {user ? (user.user_metadata?.full_name?.[0] || user.email?.[0] || "U") : "A"}
          </div>
          <div>
            <h2 className="text-body-lg font-body font-bold text-on-surface">
              {user ? (user.user_metadata?.full_name || user.email) : "Invitado"}
            </h2>
            <p className="text-caption text-primary">
              {user ? "Miembro" : "Inicia sesión para más"}
            </p>
          </div>
        </div>

        {/* Supabase Warning */}
        {!isSupabaseConfigured && (
          <div className="mx-4 mb-4 flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
            <span className="material-symbols-outlined text-yellow-400 text-xl mt-0.5">warning</span>
            <div>
              <p className="text-caption text-yellow-400 font-semibold">Supabase no configurado</p>
              <p className="text-[11px] text-on-surface-variant/70 mt-1">
                Crea un archivo <code className="text-yellow-400/80">.env</code> con tus credenciales de Supabase.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={close}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 mx-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-primary"
                }`
              }
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="text-label-md font-body font-semibold">{link.label}</span>
            </NavLink>
          ))}

          <div className="border-t border-outline-variant/30 my-4 mx-4" />

          {/* Auth Section */}
          {user ? (
            <button
              onClick={() => { signOut(); close(); }}
              className="flex items-center gap-4 p-3 mx-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full text-left"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="text-label-md font-body font-semibold">Cerrar sesión</span>
            </button>
          ) : (
            <button
              onClick={() => { setShowAuthModal(true); close(); }}
              disabled={!isSupabaseConfigured}
              className="flex items-center gap-4 p-3 mx-2 rounded-lg text-primary hover:bg-primary/10 transition-all duration-200 w-full text-left disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">login</span>
              <span className="text-label-md font-body font-semibold">
                {isSupabaseConfigured ? "Iniciar sesión" : "Sin Supabase"}
              </span>
            </button>
          )}
        </nav>

        {/* Drawer Footer */}
        <div className="px-6 mt-auto">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between mb-6 bg-surface p-3 rounded-lg border border-outline-variant/30">
            <span className="text-label-md font-body text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-xl">
                {theme === "dark" ? "dark_mode" : "light_mode"}
              </span>
              Modo {theme === "dark" ? "oscuro" : "claro"}
            </span>
            <button
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                theme === "dark" ? "bg-primary" : "bg-surface-variant"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                  theme === "dark" ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>

          {/* Social Links */}
          <p className="text-[10px] text-on-surface-variant/50 mb-3 uppercase tracking-wider">
            Sígueme
          </p>
          <div className="flex gap-3 mb-6">
            {secondaryLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant hover:bg-primary hover:text-on-primary transition-colors duration-300"
              >
                <span className="material-symbols-outlined text-sm">{social.icon}</span>
              </a>
            ))}
          </div>

          <p className="text-[10px] text-on-surface-variant/30 text-center">v1.0.0</p>
        </div>
      </aside>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
