# DnD Wedding

Session tools for a DnD one shot, built with [Nuxt UI](https://ui.nuxt.com).

## Admiration Matrix

The home page (`/`) is a grid of the 11 NPCs (rows) against the 3 players (columns). Each cell tracks how many
admiration points that NPC holds for that player. Points can go negative.

- `-` / `+` adjust a cell by 1.
- The user icon at the end of an NPC row sends that NPC away: the row is greyed out and its `-` / `+` buttons
  disappear, so their points cannot be changed while they are off screen. Existing points stay visible. Click the icon
  again to bring them back.
- **Send everyone away** does the same for the whole cast at once. It only flips to **Bring everyone back** when every
  NPC is away, so a mixed table always sends the rest away first.
- The **Introduced** switch marks whether that NPC's name has been revealed to the players yet. It only controls
  whether the name shows up on the display (see below) — it has no effect on this page.
- **Reset all** clears every cell. It leaves the away and introduced flags alone.

State lives in `localStorage` under `dnd-wedding:admiration-points`, `dnd-wedding:away-npcs` and
`dnd-wedding:introduced-npcs`, so it survives a reload and stays in sync between browser windows on the same machine.
It is not shared across machines or browsers.

To change the cast, edit `app/data/npcs.ts` (images live in `public/NPCs`) and `app/data/players.ts`.

## Display

**Open display** opens `/present` in a new tab — a full-screen, white-background grid of the portraits of every NPC
that is currently *not* away. One NPC fills the whole screen; more NPCs tile side by side, growing into more rows as
the count goes up. If an NPC has been marked **Introduced** on `/`, their name appears beneath their portrait in the
[Tangerine](https://fonts.google.com/specimen/Tangerine) Google Font; otherwise only the portrait shows. It has no
controls: put it on a second screen or projector for the players and drive the away/introduced status from `/` on
your own screen. Since both pages read the same `localStorage` state, changes on `/` update the display live, even
across windows.

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
