# Deployment Guide

## Repository Model

Use one GitHub repository for the monorepo. Commit source and config only: `apps/`, `packages/`, root workspace files, `pnpm-lock.yaml`, `.github/`, and docs. Do not commit `node_modules`, `.next`, `.turbo`, `.env*`, `dist`, or app-store build outputs.

Main branches:

- `main`: production deployments.
- `develop`: optional integration branch.
- feature branches: `feat/shops-api`, `fix/location-modal`, etc.

## GitHub

CI runs on pushes to `main` and all pull requests via `.github/workflows/ci.yml`.

Required PR checks should be:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

Keep pull requests scoped to one app/package when possible. Mention affected workspaces, for example `apps/web`, `apps/api`, or `packages/theme`.

## Web Deployment: Vercel

Create one Vercel project for the web app from the same GitHub repo.

Recommended Vercel settings:

- Framework Preset: `Next.js`
- Root Directory: `apps/web`
- Install Command: `pnpm install --frozen-lockfile`
- Build Command: `pnpm build`
- Output Directory: leave default
- Node.js Version: `20.x`

Environment variables belong in Vercel Project Settings, not in Git. Add `NEXT_PUBLIC_API_BASE_URL` when the API is deployed.

Vercel supports monorepos and Turborepo deployments; keep shared packages referenced through `workspace:*` so Vercel links them from the same repo.

## API Deployment

`apps/api` is a NestJS service. Prefer a backend host that supports long-running Node services and PostgreSQL, such as Render, Railway, Fly.io, or a VPS.

Build and start commands:

- Install: `pnpm install --frozen-lockfile`
- Build: `pnpm --filter @shopnearby/api build`
- Start: `pnpm --filter @shopnearby/api start:prod`

Add `start:prod` once real API hosting is configured.

## Mobile App Deployment

Use Expo EAS for native builds and submissions.

Recommended flow:

1. Finish the Expo scaffold in `apps/mobile`.
2. Run `pnpm --filter @shopnearby/mobile dev` locally.
3. Add EAS config with `eas init` from `apps/mobile`.
4. Build preview apps with `eas build --profile preview`.
5. Submit store builds with `eas submit`.

Use the Expo GitHub integration or EAS Workflows later for mobile CI/CD.
