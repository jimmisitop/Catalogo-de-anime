import { useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";

export default function RegisterForm({ onSwitchToLogin, onSuccess }) {
  const { signUp } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, username);
      setSuccess(true);
    } catch (err) {
      const msg = err.message || "";
      if (msg.includes("already registered") || msg.includes("already exists")) {
        setError("Este correo ya está registrado. Intenta con otro o inicia sesión.");
      } else if (msg.includes("valid email")) {
        setError("El correo no es válido. Verifica el formato.");
      } else if (msg.includes("Unable to connect") || msg.includes("fetch")) {
        setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
      } else {
        setError(msg || "Error al crear la cuenta. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Success State ──
  if (success) {
    return (
      <div className="p-6 md:p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-green-400 text-4xl">mark_email_read</span>
        </div>
        <h2 className="text-headline-md font-headline font-bold text-on-surface mb-3">
          ¡Revisa tu correo!
        </h2>
        <p className="text-body-md text-on-surface-variant mb-2 max-w-sm mx-auto">
          Te enviamos un enlace de confirmación a{" "}
          <span className="text-primary font-semibold">{email}</span>.
        </p>

        {/* Steps */}
        <div className="bg-surface-container-high rounded-xl p-4 my-6 text-left max-w-sm mx-auto">
          <div className="flex gap-3 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold flex-shrink-0 mt-0.5">1</div>
            <p className="text-body-md text-on-surface-variant">Abre tu correo y busca el mensaje de AnimeCatalog</p>
          </div>
          <div className="flex gap-3 mb-3">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold flex-shrink-0 mt-0.5">2</div>
            <p className="text-body-md text-on-surface-variant">Haz clic en <span className="text-primary font-semibold">"Confirmar cuenta"</span></p>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-on-primary text-xs font-bold flex-shrink-0 mt-0.5">3</div>
            <p className="text-body-md text-on-surface-variant">Serás redirigido aquí y podrás iniciar sesión</p>
          </div>
        </div>

        <p className="text-caption text-on-surface-variant/60 mb-6">
          ¿No ves el correo? Revisa tu carpeta de spam.
        </p>

        <button
          onClick={onSwitchToLogin}
          className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-label-md font-body font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 mx-auto"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          Volver al login
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-primary text-3xl">person_add</span>
        </div>
        <h2 className="text-headline-md font-headline font-bold text-on-surface">
          Crear cuenta
        </h2>
        <p className="text-body-md text-on-surface-variant mt-2">
          Únete y guarda tus animes favoritos
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="text-caption text-on-surface-variant uppercase tracking-wider mb-2 block">
            Nombre de usuario
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              badge
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg pl-11 pr-4 py-3 text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-body-md"
              placeholder="Tu nombre"
            />
          </div>
        </div>

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
              placeholder="Mínimo 6 caracteres"
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

        {/* Confirm Password */}
        <div>
          <label className="text-caption text-on-surface-variant uppercase tracking-wider mb-2 block">
            Confirmar contraseña
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
              lock_reset
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg pl-11 pr-4 py-3 text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all text-body-md"
              placeholder="Repite tu contraseña"
            />
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
              Creando cuenta...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                person_add
              </span>
              Crear Cuenta
            </>
          )}
        </button>
      </form>

      {/* Switch to login */}
      <div className="mt-6 text-center">
        <p className="text-body-md text-on-surface-variant">
          ¿Ya tienes cuenta?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-primary font-semibold hover:underline transition-colors"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}
