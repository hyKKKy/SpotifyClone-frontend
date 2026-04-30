# Spotify Clone Frontend

React/Vite frontend for a Spotify-style music library, player, auth flow, and admin studio.

## Scripts

- `npm run dev` starts Vite.
- `npm run build` creates a production build.
- `npm run lint` runs ESLint.
- `npm run preview` serves the production build locally.

## Architecture

The source tree uses a lightweight feature-sliced structure:

- `app` contains application composition: providers, routing, and app-level styles.
- `pages` contains route screens only.
- `widgets` contains larger layout blocks used by pages and the app shell.
- `features` contains user-facing behaviors such as auth guards and player state.
- `entities` contains music domain models and UI cards.
- `shared` contains reusable infrastructure, styles, API helpers, and generic UI.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for folder rules and import boundaries.
