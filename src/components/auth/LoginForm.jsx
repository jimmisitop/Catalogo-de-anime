import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";

export default function LoginForm({ onSwitchToRegister, onSuccess }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      onSuccess?.();
    } catch (err) {
      // Map Supabase errors to friendly messages
      const msg = err.message || "";
      if (msg.includes("Invalid login credentials") || msg.includes("invalid_credentials")) {
        setError("Email o contraseña incorrectos. Verifica tus datos e intenta de nuevo.");
      } else if (msg.includes("Email not confirmed")) {
        setError("Tu correo aún no fue confirmado. Revisa tu bandeja de entrada.");
      } else if (msg.includes("Too many requests")) {
        setError("Demasiados intentos. Espera un momento y vuelve a intentar.");
      } else if (msg.includes("Unable to connect") || msg.includes("fetch")) {
        setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
      } else {
        setError(msg || "Error al iniciar sesión. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-primary text-3xl">person</span>
        </div>
        <h2 className="text-headline-md font-headline font-bold text-on-surface">
          Bienvenido de vuelta
        </h2>
        <p className="text-body-md text-on-surface-variant mt-2">
          Inicia sesión para acceder a tu catálogo
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-error-container/20 border border-error/30 rounded-xl p-4 mb-6">
          <span className="material-symbols-outlined text-error text-xl mt-0.5">error</span>
          <p className="text-body-md text-error">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="text-caption text-on-surface-variant uppercase tracking-wider mb-2 block">
            Email
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              mail
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg pl-11 pr-4 py-3 text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-body-md"
              placeholder="tu@email.com"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-caption text-on-surface-variant uppercase tracking-wider mb-2 block">
            Contraseña
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              lock
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg pl-11 pr-12 py-3 text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-body-md"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary-container text-on-primary text-label-md font-body font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,182,144,0.15)]"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              Iniciando sesión...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                login
              </span>
              Iniciar Sesión
            </>
          )}
        </button>
      </form>

      {/* Switch to register */}
      <div className="mt-6 text-center">
        <p className="text-body-md text-on-surface-variant">
          ¿No tienes cuenta?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-primary font-semibold hover:underline transition-colors"
          >
            Regístrate
          </button>
        </p>
      </div>
    </div>
  );
}
