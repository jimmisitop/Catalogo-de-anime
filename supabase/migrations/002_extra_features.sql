-- ============================================
-- AnimeCatalog - Tablas extra: Historial, Listas, Reseñas
-- ============================================

-- ────────────────────────────────────────────
-- 1. HISTORIAL DE VISUALIZACIÓN
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  anime_id INTEGER NOT NULL,
  anime_title TEXT,
  anime_image TEXT,
  last_episode INTEGER DEFAULT 0,
  total_seconds_watched INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, anime_id)
);

ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios ven su historial"
  ON watch_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "usuarios insertan en su historial"
  ON watch_history FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "usuarios actualizan su historial"
  ON watch_history FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "usuarios eliminan de su historial"
  ON watch_history FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_watch_history_user ON watch_history(user_id);
CREATE INDEX idx_watch_history_last ON watch_history(user_id, last_watched_at DESC);


-- ────────────────────────────────────────────
-- 2. LISTAS PERSONALIZADAS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS custom_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, name)
);

ALTER TABLE custom_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios ven sus listas"
  ON custom_lists FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "cualquiera ve listas públicas"
  ON custom_lists FOR SELECT USING (is_public = TRUE);

CREATE POLICY "usuarios crean sus listas"
  ON custom_lists FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "usuarios actualizan sus listas"
  ON custom_lists FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "usuarios eliminan sus listas"
  ON custom_lists FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_custom_lists_user ON custom_lists(user_id);


-- ────────────────────────────────────────────
-- 3. ANIMES DENTRO DE LISTAS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID REFERENCES custom_lists(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  anime_id INTEGER NOT NULL,
  anime_title TEXT,
  anime_image TEXT,
  note TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (list_id, anime_id)
);

ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "usuarios ven items de sus listas"
  ON list_items FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM custom_lists
      WHERE custom_lists.id = list_id AND custom_lists.is_public = TRUE
    )
  );

CREATE POLICY "usuarios agregan items a sus listas"
  ON list_items FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "usuarios actualizan items de sus listas"
  ON list_items FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "usuarios eliminan items de sus listas"
  ON list_items FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_list_items_list ON list_items(list_id);
CREATE INDEX idx_list_items_user ON list_items(user_id);


-- ────────────────────────────────────────────
-- 4. RESEÑAS DE USUARIOS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  anime_id INTEGER NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  title TEXT,
  content TEXT,
  contains_spoilers BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, anime_id)
);

ALTER TABLE user_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cualquiera lee reseñas"
  ON user_reviews FOR SELECT USING (TRUE);

CREATE POLICY "usuarios crean sus reseñas"
  ON user_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "usuarios actualizan sus reseñas"
  ON user_reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "usuarios eliminan sus reseñas"
  ON user_reviews FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_reviews_anime ON user_reviews(anime_id);
CREATE INDEX idx_reviews_user ON user_reviews(user_id);
CREATE INDEX idx_reviews_rating ON user_reviews(anime_id, rating DESC);


-- ────────────────────────────────────────────
-- 5. LIKES A RESEÑAS
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS review_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  review_id UUID REFERENCES user_reviews(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, review_id)
);

ALTER TABLE review_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cualquiera lee likes"
  ON review_likes FOR SELECT USING (TRUE);

CREATE POLICY "usuarios dan like"
  ON review_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "usuarios quitan like"
  ON review_likes FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_review_likes_review ON review_likes(review_id);
CREATE INDEX idx_review_likes_user ON review_likes(user_id);
