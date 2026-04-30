# Frontend Architecture

This project follows a small, practical feature-sliced architecture. The goal is to keep routing, product screens, domain logic, and low-level utilities separated without adding ceremony.

## Layers

- `src/app` is the application shell. Keep providers, router setup, and global app styles here.
- `src/pages` contains route-level screens. Pages compose widgets, features, entities, and shared UI.
- `src/widgets` contains large reusable UI sections, such as the Spotify layout shell.
- `src/features` contains behavior-oriented modules, such as authentication guards and player state.
- `src/entities` contains domain concepts, such as music catalog models and album/artist/track UI.
- `src/shared` contains framework-agnostic helpers, API primitives, shared styles, and generic UI.

## Import Rules

Use aliases instead of deep relative imports:

- `@app/*`
- `@pages/*`
- `@widgets/*`
- `@features/*`
- `@entities/*`
- `@shared/*`

Higher layers may depend on lower layers. Lower layers should not import from route pages or the app shell. When shared state is needed, use `useAppContext` from `@shared/lib/app-context` rather than importing React context directly.

## Backend Access

Backend URL resolution and response normalization live in `src/shared/api`. Feature or page code should call the request function exposed by `AppProvider` instead of constructing fetch clients repeatedly.
