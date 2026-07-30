# Grind — from nothing to a million

An isometric pixel-art game where your double sits at a computer. They earn only
from the work you actually do: write down your tasks, tick them off, and that
money is what pays for food and rent. Whatever is left goes into gear, furniture
and a better place to live — from a basement room to a seaside villa.

Built with Next.js 14 (App Router), zustand persisted to `localStorage`, and a
hand-rolled pixel/isometric renderer on a `<canvas>`.

## How it plays

- **Tasks** (`Work`) are your real work. Small, medium and large tasks pay
  differently. Every payout is multiplied by your career level, the gear you own
  and your current energy.
- **Jobs** have a deadline and a large payout. Each finished task delivers 1–3
  units toward one. Missing a deadline costs reputation, and reputation is what
  unlocks bigger jobs.
- **Habits** (`Habits`) pay nothing directly — they restore energy, and energy
  multiplies every payout. Exhausted, you earn a fraction of what you would
  rested.
- **Food and rent** are charged over time. Rent falls due every 7 days.
- **The harsh part:** two days past due on rent and you are evicted a tier down,
  losing anything that will not fit somewhere smaller. Three days without food
  and you have to sell something to eat.
- **The goal:** a net worth of one million.

Days that pass while the app is closed are simulated when you come back, along
with a report of what happened. A long absence is capped: you can never lose
more than one eviction and three possessions to it.

Money stays in Czech koruna — the economy is calibrated to Czech prices, and the
million only means something at that scale.

## Cloud sync (optional)

Sync stores your save in Upstash Redis under a private code, so you can pull it
down on a phone. It is manual in both directions: with no accounts there is
nothing to merge two devices with, so an automatic push could silently overwrite
newer progress.

Connect an Upstash Redis store to the Vercel project, then pull the credentials
locally:

```bash
npx vercel link && npx vercel env pull .env.local
```

`UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are used, and the older
`KV_REST_API_URL` / `KV_REST_API_TOKEN` names also work. Without them the API
replies 503 and the UI hides sync — the game and the file backup carry on
regardless.

The sync code is the only thing protecting a save: 60 bits of randomness, used
as both address and password. Saves expire after 180 days untouched.

## Development

```bash
npm install
npm run dev
```

Run `npm run build` only with the dev server stopped; both write to `.next` and
a production build will pull the chunks out from under a running dev server.

## Structure

| Path | What lives there |
| --- | --- |
| `lib/store.ts` | All game state and rules, including the elapsed-day catch-up |
| `lib/constants.ts` | The economy — prices, payouts, housing, shop catalogue |
| `lib/pixel.ts` | Pixel engine: sprites as character grids plus a palette |
| `lib/iso.ts` | Isometric primitives (tiles, extruded boxes, walls) |
| `lib/isoSprites.ts` | Sprites for the character, screens and wall fittings |
| `lib/isoScene.ts` | Room composition — palette and layout per housing tier |
| `lib/backup.ts` | Export and import of a save |
| `components/` | UI: the room, top bar, work / habits / shop / home screens |

Progress is stored locally in the browser under the key `grind-v1`. Back it up
from **Home → Back up your progress**; **Start again from nothing** wipes it.
