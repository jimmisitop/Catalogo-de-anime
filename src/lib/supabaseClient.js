import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ── Check if Supabase is configured ──
const isConfigured = supabaseUrl && supabaseAnonKey
  && supabaseUrl !== "" && supabaseAnonKey !== ""
  && !supabaseUrl.includes("tu-proyecto")
  && !supabaseAnonKey.includes("tu-anon-key");

if (!isConfigured) {
  console.warn(
    "%c⚠️ Supabase no está configurado",
    "color: #ffb690; font-size: 14px; font-weight: bold;"
  );
  console.warn(
    "Crea un archivo .env en la raíz del proyecto con:\n" +
    "  VITE_SUPABASE_URL=https://TU-PROYECTO.supabase.co\n" +
    "  VITE_SUPABASE_ANON_KEY=tu-anon-key-aquí\n\n" +
    "Obtén estos valores desde: https://supabase.com/dashboard → Settings → API"
  );
}

// ── Create client (always, even without config, to avoid crashes) ──
const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// ── Helper: check if a specific table exists (for friendly errors) ──
export async function checkTableExists(tableName) {
  if (!isConfigured) return false;
  try {
    const { error } = await supabase.from(tableName).select("id").limit(1);
    // If the error says the relation doesn't exist, the table is missing
    if (error && error.message && error.message.includes("does not exist")) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ── Helper: get a user-friendly error message for Supabase errors ──
export function getSupabaseErrorMessage(error) {
  if (!error) return "Error desconocido";

  const msg = error.message || error.error_description || "";

  // Auth errors
  if (msg.includes("Invalid login credentials") || msg.includes("invalid_credentials")) {
    return "Email o contraseña incorrectos.";
  }
  if (msg.includes("Email not confirmed")) {
    return "Tu correo aún no fue confirmado. Revisa tu bandeja de entrada.";
  }
  if (msg.includes("already registered") || msg.includes("already exists")) {
    return "Este correo ya está registrado.";
  }
  if (msg.includes("Too many requests") || msg.includes("rate_limit")) {
    return "Demasiados intentos. Espera un momento.";
  }

  // Database errors
  if (msg.includes("does not exist") || msg.includes("relation") || msg.includes("42P01")) {
    return "Las tablas de la base de datos no existen. Ejecuta el script SQL en el SQL Editor de Supabase.";
  }
  if (msg.includes("permission denied") || msg.includes("RLS") || msg.includes("42501")) {
    return "No tienes permisos para esta operación. Verifica las políticas de RLS en Supabase.";
  }
  if (msg.includes("new row violates") || msg.includes("foreign key")) {
    return "Error de integridad de datos. Verifica que los datos sean correctos.";
  }

  // Network errors
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("ERR_NETWORK")) {
    return "No se pudo conectar con Supabase. Verifica tu conexión a internet y la URL de tu proyecto.";
  }
  if (msg.includes("timeout")) {
    return "La operación tardó demasiado. Intenta de nuevo.";
  }

  // Fallback
  return msg || "Error desconocido. Intenta de nuevo.";
}

export { isConfigured };
export default supabase;
