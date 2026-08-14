# DnD Wedding

Session tools for a DnD one shot, built with [Nuxt UI](https://ui.nuxt.com).

## Admiration Matrix

The home page (`/`) is a grid of the 11 NPCs (rows) against the 3 players (columns). Each cell tracks how many
admiration points that NPC holds for that player. Points can go negative.

- `-` / `+` adjust a cell by 1.
- The right column totals a single NPC's admiration across all players.
- The bottom row totals a single player's admiration across all NPCs.
- **Reset all** clears every cell.

State lives in `localStorage` under `dnd-wedding:admiration-points`, so it survives a reload and stays in sync between
browser windows on the same machine. It is not shared across machines or browsers.

To change the cast, edit `app/data/npcs.ts` (images live in `public/NPCs`) and `app/data/players.ts`.

## Setup

Install dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Checks

```bash
pnpm lint
pnpm typecheck
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Renovate integration

Install [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository and you are good to go.
