# Repository Guidelines

## Project Structure & Module Organization

ShopNearBy is now a PNPM/Turborepo monorepo. Apps live in `apps/`: `apps/web` contains the Next.js app, `apps/mobile` is the Expo placeholder, and `apps/api` is the NestJS placeholder. Shared code lives in `packages/`: `theme`, `types`, `validation`, `sdk`, `config`, `utils`, and `ui`.

In `apps/web`, route files remain in `src/app`, but product code should be feature-first under `src/features`. Current feature areas include `shops`, `location`, and `saved`, each owning its own components, hooks, services, store, data, and types as needed. Keep generic shell UI in `src/components/ui` only when it is not domain-specific.

## Build, Test, and Development Commands

Use PNPM from the repository root.

- `pnpm install`: install and link all workspace packages.
- `pnpm dev`: run Turborepo development tasks.
- `pnpm build`: build all workspaces through Turbo.
- `pnpm lint`: run lint tasks across workspaces.
- `pnpm typecheck`: run TypeScript checks across workspaces.

For a single app, use filters, for example `pnpm --filter @shopnearby/web dev`.

## Coding Style & Naming Conventions

Use TypeScript throughout. Components use PascalCase (`ShopCard.tsx`), hooks use a `use` prefix, and feature services use descriptive names such as `shop.service.ts`. Prefer feature-local imports before promoting code to `packages/`. Shared package names use the `@shopnearby/*` scope.

## Testing Guidelines

Automated tests are not configured yet. Before submitting changes, run `pnpm lint` and `pnpm typecheck`; for UI changes, manually verify the affected route in `apps/web`. Add future tests near the feature they cover, using names like `ShopCard.test.tsx` or `shop.service.spec.ts`.

## Commit & Pull Request Guidelines

Keep commit messages short and imperative, optionally using prefixes such as `feat:`, `fix:`, or `chore:`. Pull requests should describe the change, list affected apps/packages, include validation steps, link relevant issues, and include screenshots for visible UI changes.

## Architecture Rules

Share tokens, types, validation schemas, SDK calls, utilities, and business logic through `packages/`. Do not prematurely share full cross-platform UI components; navigation, layout, gestures, tables, and mobile-specific surfaces should stay app-owned until the platform needs are proven.
