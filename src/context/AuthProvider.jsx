import { useEffect, useState } from "react";
import supabase, { isConfigured } from "../lib/supabaseClient.js";
import AuthContext from "./AuthContext.jsx";

class SupabaseNotConfiguredError extends Error {
  constructor() {
    super("Supabase no está configurado. Crea el archivo .env con tus credenciales de Supabase.");
    this.name = "SupabaseNotConfigured";
  }
}

// Get the base URL for redirects (works in dev and production)
function getRedirectUrl(path = "/") {
  const base = window.location.origin;
  return `${base}${path}`;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    // Handle the auth callback (email confirmation redirect)
    // Supabase adds #access_token=... or ?code=... to the URL
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch((err) => {
      console.error("Error checking session:", err);
      setLoading(false);
    });

    // Listen for auth changes (this fires when email is confirmed)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      // If user just confirmed email, redirect to home
      if (event === "SIGNED_IN" && window.location.hash.includes("access_token")) {
        // Clean the URL (remove the token hash)
        window.history.replaceState({}, "", "/");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Register
  const signUp = async (email, password, username) => {
    if (!isConfigured) throw new SupabaseNotConfiguredError();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: username },
        emailRedirectTo: getRedirectUrl("/"),
      },
    });
    if (error) throw error;
    return data;
  };

  // Sign in
  const signIn = async (email, password) => {
    if (!isConfigured) throw new SupabaseNotConfiguredError();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // Sign out
  const signOut = async () => {
    if (!isConfigured) throw new SupabaseNotConfiguredError();

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isSupabaseConfigured: isConfigured,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
