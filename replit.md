# Allowlist Browser

A privacy-focused mobile browser for Android that restricts web navigation to a remote CSV-based allow list, with favorites, dual-language support (Norwegian/English), and smart search handling.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Mobile: Expo (React Native) with expo-router

## Where things live

- `artifacts/allowlist-browser/` — Expo mobile app (the browser)
- `artifacts/allowlist-browser/context/AppContext.tsx` — central state: language, favorites, allowlist/blacklist maps, reported domains
- `artifacts/allowlist-browser/constants/strings.ts` — all i18n strings (Norwegian + English)
- `artifacts/allowlist-browser/constants/colors.ts` — design tokens
- `artifacts/allowlist-browser/app/(tabs)/index.tsx` — Home tab: WebView + filtering logic
- `artifacts/allowlist-browser/app/(tabs)/favorites.tsx` — Favorites tab
- `artifacts/allowlist-browser/app/(tabs)/settings.tsx` — Settings tab (language, CSV URLs, export)
- `artifacts/api-server/` — Express API server (currently just health endpoint)
- `lib/api-spec/openapi.yaml` — OpenAPI source of truth

## Architecture decisions

- **Frontend-only persistence:** All filtering, favorites, reported domains, and language are stored in AsyncStorage. No backend needed for the browser's core functionality.
- **CSV fetching at startup:** Allowlist and blacklist CSVs are fetched from GitHub on app launch and cached in AsyncStorage. The app works offline with cached data.
- **Main-frame filtering only:** `onShouldStartLoadWithRequest` in React Native WebView only intercepts main-frame navigation on Android — sub-resources (images, CSS, JS) are never blocked.
- **Built-in fallback allowlist:** DuckDuckGo and Wikipedia are always in the allowlist so search works before users configure their GitHub CSV URLs.
- **Language switching via context:** All UI strings live in `constants/strings.ts` under `no` and `en` keys. Changing language updates the context and all components re-render instantly.

## Product

### Allowlist Browser — Core Features
- **Start Page:** Shield logo, smart search bar, favorites quick-access grid
- **WebView Tab (Home):** Full browser with URL bar, back/forward/reload, star to favorite
- **4 Navigation States:**
  - ✅ **Allowed** — green banner with reason from CSV
  - 🚫 **Blacklisted** — red screen with reason from CSV
  - 🕐 **Pending** — purple screen (user reported, awaiting review)
  - 🔒 **Not Approved** — dark screen with "Report as Safe" button
- **Favorites Tab:** List of saved sites with remove button; tap to navigate
- **Settings Tab:** Language toggle (NO/EN), GitHub CSV URLs, Update Lists button, Export favorites

## User preferences

- Primary target: Android (React Native WebView)
- Languages: Norwegian (default) and English
- CSV format: `Domain, Reason` with optional quoted values

## Gotchas

- The GitHub CSV URLs must be **raw** URLs (raw.githubusercontent.com), not the GitHub HTML page URLs
- `react-native-webview` must stay at `13.15.0` for Expo Go compatibility
- `expo-clipboard` must stay at `~8.0.8` for Expo SDK compatibility
- `onShouldStartLoadWithRequest` behaves differently on iOS vs Android — on iOS it fires for all resources, on Android only for top-frame navigation (which is what we want)
- WebView is not available on web (Platform.OS === 'web') — a placeholder is shown in web preview

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Configure GitHub CSV URLs in Settings tab → update to real raw.githubusercontent.com URLs
