# 🎌 AnimeCatalog

Catálogo de anime con información de [AniList](https://anilist.co/). Permite explorar, buscar y guardar animes favoritos.

## 🚀 Stack

- **Frontend:** React 19 + Vite 7
- **Estilos:** Tailwind CSS 4
- **API:** GraphQL (AniList) via Apollo Client 4
- **Auth & DB:** Supabase (email/password + PostgreSQL)
- **Despliegue:** Vercel

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/jimmisitop/Catalogo-de-anime.git
cd animeCatalog

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env
# Editar .env con tus credenciales de Supabase

# Iniciar servidor de desarrollo
npm run dev
```

## 🔑 Variables de entorno

Crea un archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualizar build de producción |
| `npm run lint` | Verificar código con ESLint |

## 📁 Estructura del proyecto

```
src/
├── main.jsx           # Entry point + Apollo Provider
├── App.jsx            # Router principal
├── lib/
│   ├── apolloClient.js    # Configuración de Apollo Client (AniList)
│   └── supabaseClient.js  # Cliente de Supabase
├── components/        # Componentes UI reutilizables
├── pages/             # Páginas/rutas
├── graphql/           # Queries y fragments de AniList
└── utils/             # Funciones utilitarias
```

## 🌐 Despliegue

1. Crear proyecto en [Supabase](https://supabase.com/) y ejecutar las migraciones SQL
2. Conectar el repo a [Cloudflare Pages](https://pages.cloudflare.com/)
3. Configurar variables de entorno en el dashboard de Cloudflare
4. Build command: `npm run build` | Output directory: `dist`

## 📝 Licencia

Proyecto privado.
