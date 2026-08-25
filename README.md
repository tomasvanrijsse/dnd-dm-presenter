# DM Presenter

Session tools for a DnD one shot, built with [Nuxt UI](https://ui.nuxt.com).

## Points

The home page (`/`) is a grid of the NPCs (rows) against the players (columns). Each cell tracks how many points
that NPC holds for that player. Points can go negative.

- **Add NPC** opens a form to create an NPC (name, image path, rich-text description). Clicking an NPC's name or
  avatar opens a view of their description with **Edit** and **Delete** buttons.
- `-` / `+` adjust a cell by 1.
- The user icon at the end of an NPC row sends that NPC away: the row is greyed out and its `-` / `+` buttons
  disappear, so their points cannot be changed while they are off screen. Existing points stay visible. Click the icon
  again to bring them back.
- **Send everyone away** does the same for the whole cast at once. It only flips to **Bring everyone back** when every
  NPC is away, so a mixed table always sends the rest away first.
- The **Introduced** switch marks whether that NPC's name has been revealed to the players yet. It only controls
  whether the name shows up on the display (see below) — it has no effect on this page.
- **Reset all** clears every cell. It leaves the away and introduced flags alone.

State lives in `localStorage` under `dm-presenter:points`, `dm-presenter:away-npcs` and
`dm-presenter:introduced-npcs`, so it survives a reload and stays in sync between browser windows on the same machine.
It is not shared across machines or browsers.

## Session Events

The `/session-events` page tracks what happens round by round. **Add row** creates a row with an editable title
(defaults to `Round N`) and a description of what's happening. Drag names from **Unassigned** into a group, or
**Away**; groups have no size limit. The trash icon on a row removes it.

State lives in `localStorage` under `dm-presenter:session-rows` and `dm-presenter:session-assignments`, so it
survives a reload and stays in sync between browser windows on the same machine.

## Admin

The `/admin` page manages the players used across every other page: add, edit, and remove players (name). NPCs are
managed from the Points page instead (see above). Both live in `localStorage` under `dm-presenter:npcs`
and `dm-presenter:players` — there's no more `app/data/npcs.ts` or `app/data/players.ts` to edit by hand. NPC images
still live in `public/NPCs`; point the image field at `/NPCs/your-file.jpg`.

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
