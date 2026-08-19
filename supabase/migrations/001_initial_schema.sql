-- ============================================
-- AnimeCatalog - Initial Schema
-- ============================================

-- Tabla de perfiles de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de favoritos / watchlist
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  anime_id INTEGER NOT NULL,        -- ID de AniList
  anime_title TEXT,                  -- Cache del título
  anime_image TEXT,                  -- Cache de la imagen
  anime_score INTEGER,               -- Cache del score
  status TEXT DEFAULT 'planned'      -- watching / completed / planned / dropped
    CHECK (status IN ('watching', 'completed', 'planned', 'dropped')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, anime_id)
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- Habilitar RLS en ambas tablas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Policies para profiles
CREATE POLICY "usuarios ven su propio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "usuarios actualizan su propio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "usuarios crean su propio perfil"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policies para favorites
CREATE POLICY "usuarios ven solo sus favoritos"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "usuarios insertan sus favoritos"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "usuarios actualizan sus favoritos"
  ON favorites FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "usuarios eliminan sus favoritos"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- Trigger para crear perfil automáticamente
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- Índices para performance
-- ============================================

CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_anime_id ON favorites(anime_id);
CREATE INDEX idx_favorites_user_anime ON favorites(user_id, anime_id);
