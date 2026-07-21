# দেশগড়ি · Deshgori

**Free, open-source, Bangla-first pre-departure education PWA for Bangladeshis
going abroad.** An independent educational project — **not** a government
service, and it issues **no** official document or clearance. It complements the
state portal `oc.bmet.gov.bd`.

> Flagship audience: outgoing labour migrants (Saudi corridor first).
> Secondary tracks: students and tourists.

## What ships in v1

- **Onboarding** — language toggle (Bangla default / English) → first-trip? →
  purpose → routed to a track. No account, no login, nothing sent anywhere.
- **Three tracks, fully playable** — worker (W1–W6), student (S1–S3) and tourist
  (T1), each a set of card decks with retriable quizzes.
- **Shared module "যাত্রার দিন"** — airport/luggage/transit, protective-first;
  the terminal step of every track.
- **Certificate** — client-rendered PNG with the mandatory Bangla disclaimer,
  **এটি একটি শিক্ষামূলক সনদ — কোনো সরকারি কাগজ নয়।** Name is typed at completion,
  rendered locally, never transmitted or stored.
- **Offline** — service worker precaches the app shell; usable offline after the
  first visit.
- **Progress** — stored in `localStorage` under `dg.v1.progress`, with a visible
  **নতুন শিক্ষার্থী** reset for shared devices.

## Hard constraints (never violated)

Zero PII · fully static (no backend) · educational-only certificate · unverified
facts shipped only as visible `[VERIFY: …]` drafts · low-end/offline-first ·
cloud-agnostic static output · Bangla-first.

## Stack

Next.js (App Router, `output: 'export'`) · Tailwind CSS · self-hosted Noto Sans
Bengali via `next/font` · hand-rolled service worker. No runtime third parties.

## Editing course content

Card and quiz copy lives in [`/content`](./content). Each module is a markdown
file whose fenced ` ```json ` block is the machine source parsed at build time
(`app/lib/content.ts`). Edit `content/w1.md` to change W1.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build the static site

```bash
npm run build      # emits ./out (fully static)
npm run serve      # preview the built ./out on http://localhost:3000
```

## Deploy

The `out/` directory is plain static files — deploy unchanged to Cloudflare
Pages, Firebase Hosting, S3, or a bare nginx box.

**Cloudflare Pages (target for Session A):**

- Framework preset: **Next.js (Static HTML Export)** — or "None".
- Build command: `npm run build`
- Build output directory: `out`
- Deploys to `deshgori.pages.dev`. Attach `deshgori.com` later via Cloudflare
  Registrar — zero code change.

## Audio

Audio is recorded in Session B. Until then the 🔊 **শুনুন** buttons are visible
but disabled with a **শীঘ্রই আসছে** tooltip. Files will live under
`public/audio/{track}/{module}/{cardId}.mp3` (mono, 32–48 kbps).

## License

[Apache-2.0](./LICENSE).
