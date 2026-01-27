# Integrate ratel-mind-web into Next.js (2026-01-27)

## Summary

Migrate the existing Vite-based ratel-mind-web UI into the Snowball Next.js app while keeping Snowball as a separate UI surface embedded via iframe from the ratel side. The unified Next.js app serves:

- **Ratel Mind Web** under `/ratel/*` using React Router to preserve routes and UI.
- **Snowball** pages under existing routes (`/workspace`, `/reports/...`, `/editor/...`).
- **Report Center** at `/ratel/reports` with an iframe pointing to Snowball.

## Architecture

- Next.js app (`apps/frontend`) hosts both UIs.
- Ratel UI is mounted by a client-only Next page (`/ratel/[[...slug]]`) that renders a React Router `RouterProvider` with `basename: /ratel`.
- Snowball remains a Next.js route tree; the workspace/editor pages live under an `(iframe)` route group with a shared layout.

## Auth & Token Flow

1. Ratel app uses JWT in localStorage (`access_token`).
2. `/ratel/reports` builds iframe `src` with `?token=...`.
3. Snowball reads `token` query param on load, stores it in zustand (persisted), then clears the URL with `history.replaceState`.
4. Snowball’s API wrapper sends `AUTH_EXPIRED` postMessage on 401 if running in an iframe.
5. Ratel listens for `AUTH_EXPIRED` and logs the user out.

## Iframe Layout Behavior

- Snowball detects iframe mode via `window.self !== window.top`.
- Workspace layout hides top navigation when embedded.
- Parent/child postMessage targets are restricted by env allowlist or inferred parent origin.

## Environments

- Local: `NEXT_PUBLIC_SNOWBALL_URL=http://localhost:3000`.
- Prod: `NEXT_PUBLIC_SNOWBALL_URL=https://reports.beansinfo.com`.
- Backend CORS restricted to `https://www.beansinfo.com` and `https://reports.beansinfo.com` in prod.

## Risks

- URL token handoff requires HTTPS and strict CSP.
- React Router inside Next.js is client-only; no SSR for `/ratel/*`.

## Validation Plan

- Typecheck `apps/frontend`.
- Manual smoke test: `/ratel`, `/ratel/reports`, token handoff, `AUTH_EXPIRED` message.
